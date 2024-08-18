"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Box from "@mui/system/Box";
import Input from '@mui/material/Input';
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import Typography from "@mui/material/Typography";

import { FilmDisplayProps, BEResponse, CursorPaginationProps } from "@/utils/types";
import { BACKEND_URL } from "@/utils/env";


const SearchBar: React.FC = () => {
    const [query, setquery] = useState("");
    const [films, setFilms] = useState<FilmDisplayProps[]>([]);

    const [focus, setFocus] = useState(false);
    const open = useMemo(() => !!query && focus, [query, focus]);

    const router = useRouter();

    useEffect(() => {
        if (!query) return;

        fetch(`${BACKEND_URL}/film/search?` + new URLSearchParams({
            q: query.trimEnd(),
            extend: "false",
        })).then((response) => response.json())
            .then((res: BEResponse) => {
                if (res.statusCode >= 400) {
                    setFilms([]);
                    throw res;
                }

                const data = res.data as { films: FilmDisplayProps[], cursor: CursorPaginationProps };
                setFilms(data.films);
            })
            .catch((err) => console.error(err));
    }, [query]);


    return (
        <>
            <Box display="flex" minWidth="690px">
                <Input
                    disableUnderline
                    value={query}
                    placeholder="Type an anime's name"
                    autoComplete="true"
                    onFocus={() => setFocus(true)}
                    onBlur={e => e.relatedTarget === null && setFocus(false)}
                    onChange={(e) => {
                        if (e.currentTarget.value === "") {
                            // Reset the films list if the input is empty
                            setFilms([]);
                        }

                        setquery(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                        // Send the message if the user press enter
                        if (e.key === "Enter") {
                            e.preventDefault();

                            // Prevent the user from sending empty message 
                            if (!query) return;

                            setFocus(false);

                            if (e.shiftKey) {
                                window.open(`/tim-kiem/phim?q=${query}`, "_blank");
                            } else {
                                router.push(`/tim-kiem/phim?q=${query}`);
                            }
                        }
                    }}
                    sx={{
                        border: focus ? "1px solid #1c62b9" : "1px solid rgb(48, 48, 48)",
                        borderRadius: "40px 0 0 40px",
                        padding: "4px 1rem",
                        width: "100%",
                    }}
                />
                <IconButton
                    disableRipple
                    onClick={() => {
                        if (!query) return;

                        setFocus(false);
                        router.push(`/tim-kiem/phim?q=${query}`)
                    }}
                    sx={{
                        borderRadius: "0 40px 40px 0",
                        backgroundColor: "#222222",
                        padding: "4px 1rem",
                    }}
                >
                    <SearchIcon />
                </IconButton>
            </Box>
            <Box sx={{
                display: open ? "block" : "none",
                position: "fixed",
                backgroundColor: "#212121",
                overflow: "hidden",
                height: "490px",
                width: "690px",
                top: "54px",
                margin: "0 auto",
                borderRadius: "2rem",
                padding: "1rem",
            }}>
                {films.length
                    ? <Box sx={
                        {
                            display: "flex",
                            flexDirection: "column",
                            overflowY: "auto",
                            scrollbarColor: "auto transparent",
                            width: "100%",
                            height: "100%",
                            borderRadius: "2rem",
                            // pointerEvents: "auto",
                        }
                    }
                    >
                        {films.map((film) => (
                            <Button key={film.slug} href={`/phim/${film.slug}`} sx={{ textTransform: "none" }}>
                                <Image
                                    src={film.poster}
                                    alt={film.name}
                                    width={188}
                                    height={107}
                                    style={{
                                        borderRadius: "1rem",
                                        marginRight: "1rem",
                                    }}
                                />
                                <Box width="100%">
                                    <Typography fontSize="medium" >{film.name}</Typography>
                                    <Typography
                                        sx={{
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 1,
                                            fontSize: "small",
                                            color: "text.secondary",
                                            marginBottom: "0.5rem",
                                        }}
                                    >
                                        {film.originName}
                                    </Typography>

                                    <Box display="flex" gap="6px">
                                        <p className="iconContainer"><VisibilityIcon fontSize="small" />{film.views}</p>
                                        <p className="iconContainer"><StarOutlineIcon fontSize="small" />{film.rating}</p>
                                    </Box>
                                </Box>
                            </Button>
                        ))}
                    </Box>
                    : <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        height: "100%",
                    }}>
                        <Image
                            src="/error.jpg"
                            alt="Error"
                            width={200}
                            height={200}
                            style={{
                                borderRadius: "1rem",
                            }}
                        />
                        <div>Nothing here!!!</div>
                    </Box>
                }
            </Box>
        </>
    )
}

export default SearchBar;