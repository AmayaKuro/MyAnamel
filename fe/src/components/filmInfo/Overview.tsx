"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from "@mui/material/Button";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import ListIcon from '@mui/icons-material/List';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';

import { useAlert } from '@utils/providers/alert';

import styles from "@css/component/filmInfo/Overview.module.css";


interface FilmProps {
    slug: string;
    name: string;
    originName: string;
    categories: {
        slug: string;
        name: string;
    }[];
    description: string;
    status: "ongoing" | "completed" | "upcoming" | "cancelled";
    currentEpisode: number;
    createdAt: number;
    updatedAt: number;
    totalEpisode: number;
    thumbnail: string;
    poster: string;
    trailer: string;
    subLang: string;
    views: number;
    rating: number;
    year: number;
    duration: number;
    episodes: {
        serverName: string;
        data: {
            slug: string;
            name: string;
            m3u8Link: string;
        }[]
    }[]
}


const Overview: React.FC<{ film: FilmProps }> = ({ film }) => {
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [rating, setRating] = useState(film.rating);


    return (
        <div className={"container " + styles.container}>
            <Image
                className={styles.poster}
                src={film.poster}
                alt={film.name}
                width={1920}
                height={1080}
            />

            <div className={styles.info}>
                <div className={styles.left}>
                    <Image src={film.thumbnail} alt={film.name} width={215} height={325} />
                </div>
                <div className={styles.right}>
                    <div className={styles.stats}>
                        <h2>{film.name}</h2>
                        <p className={styles.originName}>{film.originName}</p>
                        <p>
                            {rating <= 2
                                ? <StarOutlineIcon fontSize="small" />
                                : rating <= 4
                                    ? <StarHalfIcon fontSize="small" />
                                    : <StarIcon fontSize="small" />}
                            {rating}/5
                        </p>
                        <p>
                            <VisibilityIcon fontSize="small" /> {film.views}
                        </p>
                        <p>
                            <BrowseGalleryIcon fontSize="small" /> {film.duration} phút
                        </p>
                        <p>
                            <ListIcon fontSize="small" />
                            {film.currentEpisode}/{film.totalEpisode ? film.totalEpisode : "?"}
                        </p>
                    </div>
                    <Link className={styles.link} href={`/phim/${film.slug}`}>
                        <Button variant="contained" color="primary" startIcon={<LiveTvIcon />}>Xem ngay</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Overview;