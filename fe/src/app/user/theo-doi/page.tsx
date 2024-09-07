"use client";

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';


import Image from "next/image";
import Box from "@mui/system/Box";
import Typography from '@mui/material/Typography';


import { BEResponse, CursorPaginationProps, ErrorProps, FilmDisplayProps } from '@/utils/types';
import { useAuth } from '@/utils/providers/auth';
import List from '@/components/main/List';

const FollowList: React.FC = () => {
    // Currently reload this page cause duplicate fetch then duplicate films (no fix today)
    const [films, setFilms] = useState<FilmDisplayProps[]>([]);

    const params = useSearchParams();
    const { state: { accessToken }, dispatch: { BEfetch } } = useAuth();

    const unfollow = useCallback((filmSlug: string) => {
        BEfetch(`/film/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filmSlug,
                action: "unfollow",
            }),
        }).then((response) => response.json())
            .then((res) => {
                if (res.statusCode >= 400) {
                    throw res;
                } else if (res.statusCode === 200) {
                    // Return old films that not contain the deleted one, return null if list is empty 
                    setFilms((oldFilms) => oldFilms?.filter((film) => film.slug !== filmSlug) ?? null);
                }
            });
    }, [BEfetch]);

    useEffect(() => {
        if (!accessToken) return;

        BEfetch(`/user/followingFilm?` + new URLSearchParams({
            page: "1",
        })).then((response) => response.json())
            .then((res: BEResponse) => {
                if (res.statusCode >= 400) {
                    throw res;
                }
                console.log(res);

                const data = res.data as {
                    films: FilmDisplayProps[],
                    pagination: CursorPaginationProps,
                };

                setFilms(data.films);
            })
    }, [accessToken, BEfetch]);

    return (
        <Box margin="2rem 3rem" >
            <Typography variant='h2' fontSize="2em" textAlign="center" marginBottom="2rem">Đang theo dõi</Typography>

            {films.length
                ? <List films={films} follow unfollow={unfollow} />
                : <Box sx={{
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
        </Box>
    );
};

export default FollowList;