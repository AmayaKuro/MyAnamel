"use client";

import React, { useEffect, useState } from 'react';

import Image from 'next/image';
import Button from "@mui/material/Button";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import ListIcon from '@mui/icons-material/List';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import Box from '@mui/system/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import type { FilmProps } from '@utils/types';

import styles from "@css/component/filmInfo/Overview.module.css";


interface ComponentProps {
    film: FilmProps;
    followUtils: {
        following: boolean;
        followManage: () => void;
    };
}


const Overview: React.FC<ComponentProps> = ({ film, followUtils: { following, followManage } }) => {
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
                    <Box display="flex" gap="1rem">
                        <Button
                            href={film.name ? `/phim/${film.slug}/${film.episodes[0].data[0].slug}` : "#"}
                            variant="contained"
                            color="primary"
                            startIcon={<LiveTvIcon />}
                        >
                            Xem ngay
                        </Button>
                        <Button
                            onClick={() => followManage()}
                            {...(following ? {
                                variant: "contained",
                                color: "success",
                                startIcon: <FavoriteIcon />,
                            }
                                : {
                                    variant: "outlined",
                                    color: "primary",
                                    startIcon: <FavoriteBorderIcon />,
                                })}
                        >
                            {following ? "Huỷ theo dõi" : "Theo dõi"}
                        </Button>
                    </Box>
                </div>
            </div>
        </div >
    );
};

export default Overview;