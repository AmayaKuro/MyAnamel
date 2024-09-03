"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';

import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@mui/material/CircularProgress';
import Image from "next/image";
import Box from "@mui/system/Box";
import Button from "@mui/material/Button";
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import ListIcon from '@mui/icons-material/List';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { BEResponse, CursorPaginationProps, ErrorProps, ExtendedFilmDisplayProps } from '@/utils/types';
import { useAuth } from '@/utils/providers/auth';

const NameSearch: React.FC = () => {
    // Currently reload this page cause duplicate fetch then duplicate films (no fix today)
    const [films, setFilms] = useState<ExtendedFilmDisplayProps[]>([]);
    const [cursor, setCursor] = useState(""); // Cursor for pagination
    const [hasMore, setHasMore] = useState(true);

    const [filter, setFilter] = useState("newest");
    const [error, setError] = useState<ErrorProps>();

    const { dispatch: { BEfetch } } = useAuth();
    const params = useSearchParams();

    const query = useMemo(() => {
        if (!params.has("q")) {
            throw {
                statusCode: 400,
                message: "Không tìm thấy từ khoá tìm kiếm",
            };
        }

        return params.get("q")!;
    }, [params.get("q")]);


    const fetchFilms = useCallback(async () => {
        try {
            const response = await BEfetch(`/film/search?` + new URLSearchParams({
                q: query,
                cursor,
                filter,
                extend: "true",
            }));

            const res = await response.json() as BEResponse;

            if (res.statusCode >= 400) {
                throw res;
            }

            const data = res.data as {
                films: ExtendedFilmDisplayProps[],
                pagination: CursorPaginationProps,
            };

            setFilms((old) => [
                ...old,
                ...data.films,
            ]);
            setHasMore(data.films.length === 12);
            setCursor(data.pagination.cursor ?? "");
        } catch (err) {
            console.log(err);
        }
    }, [query, filter, cursor]);

    useEffect(() => {
        fetchFilms();

        // Cleanup if re-fetch
        return () => {
            setCursor("");
            setFilms([]);
        };
    }, [query, filter]);

    return (
        <>
            <Typography variant='h2' fontSize="2em" paddingLeft="1rem" marginBottom="2rem">Tìm kiếm cho từ khoá "{query}"</Typography>
            <Tabs
                value={filter}
                onChange={(event, newValue) => {
                    // Reset cursor when change filter
                    setCursor("");

                    setFilter(newValue)
                }}
                aria-label="Platform"
                sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    borderBottom: "1px solid",
                    borderBottomColor: "text.secondary",
                    marginBottom: "1rem",
                    marginInline: "3rem",
                }}
            >
                <Tab label="Mới nhất" value="newest" defaultChecked />
                <Tab label="Phổ biến" value="popular" />
            </Tabs>
            <InfiniteScroll
                dataLength={films.length}
                next={fetchFilms}
                hasMore={hasMore}
                loader={<Box display="flex" justifyContent="center" height="3rem" width="100%"><CircularProgress /></Box>}
                endMessage={
                    !!(films.length) && <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        height: "100%",
                        marginBlock: "2rem",
                    }}>
                        <Image
                            src="/cat-jump.gif"
                            alt="Error"
                            width={200}
                            height={200}
                            style={{
                                borderRadius: "1rem",
                            }}
                        />
                        <div>The end!!!</div>
                    </Box>
                }
            >
                <Box
                    display="flex"
                    flexDirection="column"
                    paddingInline="4rem"
                >
                    {films.map((film) => (
                        <Button key={film.slug} href={`/phim/${film.slug}`} sx={{ textTransform: "none", alignItems: "flex-start" }}>
                            <Image
                                src={film.poster}
                                alt={film.name}
                                width={500}
                                height={240}
                                style={{
                                    borderRadius: "1rem",
                                    marginRight: "1rem",
                                }}
                            />
                            <Box width="100%" height="min-content" fontSize="1.2em">
                                <Typography variant="h3" fontSize="1.2em">{film.name}</Typography>
                                <Typography
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
                                        color: "text.secondary",
                                        marginBottom: "0.5rem",
                                    }}
                                >
                                    {film.originName}
                                </Typography>
                                <Box display="flex" gap="6px" marginBottom="0.5rem" color="text.secondary">
                                    <p className="iconContainer"><VisibilityIcon fontSize="small" />{film.views}</p>
                                    <p className="iconContainer"><StarOutlineIcon fontSize="small" />{film.rating}</p>
                                    <p className="iconContainer"><BrowseGalleryIcon fontSize="small" /> {film.duration} phút</p>
                                    <p className="iconContainer">
                                        <ListIcon fontSize="small" />
                                        {film.currentEpisode}/{film.totalEpisode ? film.totalEpisode : "?"}
                                    </p>

                                </Box>
                                <Typography
                                    dangerouslySetInnerHTML={{ __html: film.description }}
                                    sx={{
                                        display: "-webkit-box",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1,
                                        color: "text.secondary",
                                        marginBottom: "0.5rem",
                                    }}
                                />

                            </Box>
                        </Button>
                    ))}
                </Box>
            </InfiniteScroll >
            {!hasMore && !films.length && <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "1rem",
                marginTop: "2rem",
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
            </Box>}
        </>
    );
};

export default NameSearch;