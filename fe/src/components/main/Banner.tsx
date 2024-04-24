"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LiveTvIcon from '@mui/icons-material/LiveTv';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import VisibilityIcon from '@mui/icons-material/Visibility';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarIcon from '@mui/icons-material/Star';
import ListIcon from '@mui/icons-material/List';
import BrowseGalleryIcon from '@mui/icons-material/BrowseGallery';
import DnsIcon from '@mui/icons-material/Dns';
import { Carousel } from "react-responsive-carousel";

import { BACKEND_URL } from "@utils/env";
import { useAlert } from "@utils/providers/alert";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from "@css/main/Banner.module.css";


type BannerFilmDisplay = {
    slug: string;
    name: string;
    originName: string;
    description: string;
    status: "ongoing" | "completed" | "upcoming" | "cancelled";
    categories: {
        slug: string;
        name: string;
    }[];
    currentEpisode: number;
    totalEpisode: number;
    thumbnail: string;
    poster: string;
    subLang: string;
    views: number;
    rating: number;
    year: number;
    duration: number;
}


const Banner: React.FC = () => {
    const [films, setFilms] = useState<BannerFilmDisplay[]>([]);
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();
    // Hide the switch button when the mouse is not hovering over the banner
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        fetch(`${BACKEND_URL}/film/`)
            .then((res) => res.json())
            .then((films: BannerFilmDisplay[]) => {
                setFilms(films);
            }).catch((err) => {
                setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
                setSeverity("error");
            });
    }, []);

    return (
        <div
            className={"container " + styles.container}
            onMouseOver={() => setIsHovered(true)}
            onMouseOut={() => setIsHovered(false)}
        >
            <Carousel
                autoPlay
                infiniteLoop
                interval={5000}
                stopOnHover
                swipeScrollTolerance={30}
                showThumbs={false}
                showStatus={false}
                showIndicators={isHovered}
                dynamicHeight={false}
                renderArrowNext={(clickHandler, hasNext, label) => <IconButton
                    className={styles.rightArrow + (isHovered ? "" : " " + styles.hidden)}
                    onClick={clickHandler}
                    aria-label={label}
                    children={<ArrowCircleRightIcon fontSize="large" color="primary" />}
                />}
                renderArrowPrev={(clickHandler, hasNext, label) => <IconButton
                    className={styles.leftArrow + (isHovered ? "" : " " + styles.hidden)}
                    onClick={clickHandler}
                    aria-label={label}
                    children={<ArrowCircleLeftIcon fontSize="large" color="primary" />}
                />}

            >
                {
                    films.map((film) => {
                        return (
                            <div className={styles.film} key={film.slug}>
                                <Link href={`/phim/${film.slug}`}>
                                    <Image className={styles.poster} src={film.poster} alt={film.name} width={1920} height={1080} />
                                </Link>

                                <div className={styles.overlay}>
                                    <h2>{film.name}</h2>
                                    <p className={styles.originName}>{film.originName}</p>
                                    <div className={styles.stat}>
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
                                        <p>
                                            <BrowseGalleryIcon fontSize="small" /> {film.duration} phút
                                        </p>
                                        <p>
                                            <ListIcon fontSize="small" />
                                            {film.currentEpisode}/{film.totalEpisode ? film.totalEpisode : "?"}
                                        </p>
                                    </div>
                                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: film.description }} />

                                    <div className={styles.categories}>
                                        <DnsIcon /> Thể loại: {
                                            film.categories.map((category, index) => {
                                                return [
                                                    <Link href={`/the-loai/${category.slug}`} key={category.slug} style={{ textDecoration: "none" }}>
                                                        {category.name}
                                                    </Link>,
                                                    // Add ", " after each category except the last one "."
                                                    index === film.categories.length - 1 ? "." : ", "
                                                ];
                                            })
                                        }
                                    </div>

                                    <Link className={styles.link} href={`/phim/${film.slug}`}>
                                        <Button variant="contained" color="primary" startIcon={<LiveTvIcon />}>Xem ngay</Button>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
            </Carousel >
        </div>
    );
};


export default Banner;