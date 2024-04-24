"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Carousel } from "react-responsive-carousel";

import { BACKEND_URL } from "@utils/env";
import { useAlert } from "@utils/providers/alert";

import styles from "@css/main/Slider.module.css";


type SliderFilmDisplay = {
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

const Section: React.FC = () => {
    const router = useRouter();
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [films, setFilms] = useState<SliderFilmDisplay[]>([]);

    // Hide the switch button when the mouse is not hovering over the banner
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFilmIndex, setselectedFilmIndex] = useState(0);

    useEffect(() => {
        fetch(`${BACKEND_URL}/film/`)
            .then((res) => res.json())
            .then((films: SliderFilmDisplay[]) => {
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
                infiniteLoop
                centerMode
                centerSlidePercentage={26}
                onClickItem={(index) => {
                    if (index === selectedFilmIndex) {
                        router.push(`/phim/${films[index].slug}`);
                    } else {
                        setselectedFilmIndex(index);
                    }
                }}
                onChange={(index) => setselectedFilmIndex(index)}
                selectedItem={selectedFilmIndex}
                swipeScrollTolerance={30}
                showThumbs={false}
                showStatus={false}
                showIndicators={isHovered}
                showArrows={isHovered}
                dynamicHeight={false}
            >
                {
                    films.map((film, index) => {
                        return (
                            <div key={film.slug} className={styles.film + (selectedFilmIndex === index ? " " + styles.selected : "")}>
                                <Image src={film.thumbnail} alt={film.name} fill />
                                <p className="legend">{film.name}</p>
                            </div>
                        );
                    })
                }
            </Carousel>
        </div>
    );
}


export default Section;