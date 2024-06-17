"use client";

import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import VideoPlayer from '@components/video/VideoPlayer';
import Details from '@components/filmInfo/Details';
import Image from 'next/image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';

import { useAlert } from '@utils/providers/alert';
import { BACKEND_URL } from '@utils/env';
import type { FilmProps, currentEpisodeProps, FilmDisplayProps, ErrorProps, BEResponse } from '@utils/types';

import styles from "@css/app/FilmViewer.module.css";


interface RouteParams {
    params: {
        slug: string;
        episode: string;
    }
}


const FilmViewer: React.FC<RouteParams> = ({ params: { slug, episode } }) => {
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [currentEpisode, setCurrentEpisode] = useState<currentEpisodeProps>();
    const [film, setFilm] = useState<FilmProps>({
        slug: "",
        name: "",
        originName: "",
        categories: [],
        description: "",
        status: "ongoing",
        currentEpisode: 0,
        createdAt: 0,
        updatedAt: 0,
        totalEpisode: 0,
        thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        poster: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
        trailer: "",
        subLang: "",
        views: 0,
        rating: 0,
        year: 0,
        duration: 0,
        episodes: [],
    });
    const [recommendFilms, setRecommendFilms] = useState<FilmDisplayProps[]>([]);
    const [error, setError] = useState<ErrorProps | null>(null);

    useEffect(() => {
        fetch(`${BACKEND_URL}/film/${slug}`)
            .then((response) => response.json())
            .then((res: BEResponse) => {
                if (res.statusCode >= 400) {
                    setError(res);
                }

                setFilm(res.data as FilmProps);
            }).catch((err) => {
                setError(new Error(err.message));
            });
    }, []);

    useEffect(() => {
        if (error) {
            throw error;
        };
    }, [error]);

    useEffect(() => {
        if (!film.name) return;

        const fail = film.episodes.every((server, i) => {
            // Break the loop if found
            return server.data.every((episodeInfo, y) => {
                if (episodeInfo.slug === episode) {
                    setCurrentEpisode({
                        serverIndex: i,
                        episodeIndex: y,
                    });

                    // Send viewed status to BE
                    // fetch("/api/film/viewed")
                    return false;
                }

                // If not found, return true to continue the loop
                return true;
            });
        })

        if (fail) {
            setError({
                statusCode: 400,
                message: "Episode not found!",
            });
        }
    }, [film]);


    useEffect(() => {
        if (!film.name) return;

        fetch(`${BACKEND_URL}/film/new`)
            .then((response) => response.json())
            .then((res: BEResponse) => {
                if (res.statusCode >= 400) {
                    throw res;
                }

                setRecommendFilms(res.data as FilmDisplayProps[]);
            }).catch((err) => {
                setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
                setSeverity("error");
            });
    }, [film]);

    return (
        <div className={styles.main}>
            <div className={styles.left}>
                <div className={styles.videoContainer}>
                    <VideoPlayer
                        manifest={(currentEpisode && film.name) ? film.episodes[currentEpisode.serverIndex].data[currentEpisode.episodeIndex].m3u8Link : ""}
                        poster={film ? film.poster : "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg"}
                    />
                </div>
                <Details film={film} currentEpisode={currentEpisode} />
            </div>

            <div className={styles.right}>
                <div className={styles.moreFilm}>
                    <h2>Phim cho bạn</h2>
                    {recommendFilms.map((film) => {
                        return (
                            <div key={film.slug} className={styles.film}>
                                <Link href={`/phim/${film.slug}`} >
                                    <Image src={film.poster} alt="" width={188} height={107} loading="lazy" />
                                </Link>
                                <div className={styles.info}>
                                    <Link href={`/phim/${film.slug}`} >
                                        <span>{film.name}</span>
                                        <div className={styles.stats}>
                                            <p>
                                                {film.rating <= 2
                                                    ? <StarOutlineIcon fontSize="small" />
                                                    : film.rating <= 4
                                                        ? <StarHalfIcon fontSize="small" />
                                                        : <StarIcon fontSize="small" />}
                                                {film.rating}/5
                                            </p>
                                            <p>
                                                <VisibilityIcon fontSize="small" /> {film.views}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default FilmViewer;