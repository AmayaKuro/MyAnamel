"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import { Carousel } from "react-responsive-carousel";

import { FilmDisplayProps } from "@utils/types";
import { BACKEND_URL } from "@utils/env";
import { useAlert } from "@utils/providers/alert";

import styles from "@css/component/main/Slider.module.css";


const Section: React.FC = () => {
    const router = useRouter();
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [films, setFilms] = useState<FilmDisplayProps[]>([]);

    // Hide the switch button when the mouse is not hovering over the banner
    const [isHovered, setIsHovered] = useState(false);
    const [selectedFilmIndex, setselectedFilmIndex] = useState(0);

    useEffect(() => {
        fetch(`${BACKEND_URL}/film/`)
            .then((res) => res.json())
            .then((films: FilmDisplayProps[]) => {
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