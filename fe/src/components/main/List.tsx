/**
 * List component that displays a list of films with optional follow/unfollow functionality.
 *
 * @component
 * @param {ComponentProps} props - The props for the List component.
 * @param {FilmDisplayProps[]} props.films - An array of film objects to be displayed.
 * @param {boolean} [props.follow] - A flag indicating if the follow/unfollow button should be displayed.
 * @param {function} [props.unfollow] - A function to handle the unfollow action, which takes the film slug and index as arguments.
 *
 * @returns {JSX.Element} The rendered List component.
 */
"use client";

import React, { useState, useEffect, useCallback } from "react";

import Image from "next/image";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Typography } from "@mui/material";

import { FilmDisplayProps } from "@utils/types";

import { useAuth } from "@/utils/providers/auth";

import styles from "@css/component/main/List.module.css";


/**
 * Props for the List component. If follow is true, unfollow must be provided
 *
 * @property {FilmDisplayProps[]} films - An array of film objects to be displayed.
 * @property {boolean} [follow] - A flag indicating if the follow/unfollow button should be displayed.
 * @property {function} [unfollow] - A function to handle the unfollow action, which takes the film slug and index as arguments.
 */
type ComponentProps = {
    films: FilmDisplayProps[];
} & ({
    follow: boolean;
    unfollow: (filmSlug: string) => void;
    // Do this in the future?
    // followManage: () => void;
} | {
    follow?: undefined;
    unfollow?: undefined;
});

const List: React.FC<ComponentProps> = ({ films, follow, unfollow }) => {
    return (
        <div className={"container " + styles.container}>
            {
                films.map((film, index) => {
                    return (
                        <Box display="flex" flexDirection="column" gap="1rem">
                            {follow && <Button
                                onClick={() => unfollow(film.slug)}
                                variant="contained"
                                startIcon=<FavoriteBorderIcon />
                                sx={{
                                    bgcolor: "error.light",
                                    color: "error.contrastText",
                                    ":hover": {
                                        bgcolor: "error.dark",
                                    }
                                }}
                            >
                                Huỷ theo dõi
                            </Button>}
                            <Button
                                key={film.slug}
                                href={`/phim/${film.slug}`}
                                className={styles.film}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    width: "215px",
                                    textDecoration: " none",
                                    color: "inherit",
                                }}
                            >
                                <Image src={film.thumbnail} alt={film.name} width={215} height={325} loading="lazy" />
                                <div className={styles.attributes}>
                                    {/* TODO: make this 2 line */}
                                    <Typography
                                        sx={{
                                            display: "-webkit-box",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 2,
                                            textAlign: "center",
                                        }}
                                    >
                                        {film.name}
                                    </Typography>
                                    {/* <p className={styles.view}>Lượt xem: {film.views}</p> */}
                                </div>
                            </Button>
                        </Box>
                    );
                })
            }
        </div>
    );
}


export default List;