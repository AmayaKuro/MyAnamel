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
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import ListIcon from '@mui/icons-material/List';

import { ExtendedFilmDisplayProps, ErrorResponse } from "@/utils/types";
import { BACKEND_URL } from "@/utils/env";


const SearchBar: React.FC = () => {
    const [name, setName] = useState("");
    const [films, setFilms] = useState<ExtendedFilmDisplayProps[]>([]);

    const [focus, setFocus] = useState(false);
    const open = useMemo(() => !!name && focus, [name, focus]);

    const router = useRouter();

    useEffect(() => {
        if (name === "") return;

        fetch(`${BACKEND_URL}/film/search?` + new URLSearchParams({
            name: name,
        })).then((res) => res.json())
            .then((data: ExtendedFilmDisplayProps[] & ErrorResponse) => {
                if (data.statusCode) {
                    setFilms([]);
                } else {
                    setFilms(data);
                }
            })
            .catch((err) => console.error(err));
    }, [name]);


    return (
        <>
            <Box display="flex" minWidth="690px">
                <Input
                    disableUnderline
                    value={name}
                    placeholder="Type an anime's name"
                    autoComplete="true"
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    onChange={(e) => {
                        if (e.currentTarget.value === "") {
                            // Reset the films list if the input is empty
                            setFilms([]);
                        }

                        setName(e.currentTarget.value);
                    }}
                    onKeyDown={(e) => {
                        // Send the message if the user press enter
                        if (e.key === "Enter") {
                            e.preventDefault();
                            // Prevent the user from sending empty message 
                            if (name !== "") {
                                router.push(`/search?name=${name}`);
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
                        if (name === "") return;

                        router.push(`/search?name=${name}`)
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
                            width: "100%",
                            height: "100%",
                            borderRadius: "2rem",
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
                                    <p>{film.name}</p>
                                    <p style={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
                                        color: "var(--mui-palette-text-secondary)",
                                        fontSize: "0.8em",
                                        marginBottom: "0.5rem",
                                    }}
                                    >
                                        {film.originName}</p>

                                    <Box display="flex" gap="6px">
                                        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}><VisibilityIcon fontSize="small" />{film.views}</p>
                                        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}><StarOutlineIcon fontSize="small" />{film.rating}</p>
                                        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}><BrowseGalleryIcon fontSize="small" /> {film.duration} phút</p>
                                        <p style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                            <ListIcon fontSize="small" />
                                            {film.currentEpisode}/{film.totalEpisode ? film.totalEpisode : "?"}
                                        </p>
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