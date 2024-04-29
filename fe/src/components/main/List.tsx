"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

import { BACKEND_URL } from "@utils/env";
import { useAlert } from "@utils/providers/alert";

import styles from "@css/component/main/List.module.css";


type ListFilmDisplay = {
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

const List: React.FC = () => {
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [films, setFilms] = useState<ListFilmDisplay[]>([]);


    useEffect(() => {
        fetch(`${BACKEND_URL}/film/`)
            .then((res) => res.json())
            .then((films: ListFilmDisplay[]) => {
                setFilms(films);
            }).catch((err) => {
                setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
                setSeverity("error");
            });
    }, []);

    return (
        <div className={"container " + styles.container}>
            {
                films.map((film, index) => {
                    return (
                        <Link href={`/phim/${film.slug}`} key={film.slug} className={styles.film}>
                            <Image src={film.thumbnail} alt={film.name} width={215} height={325} />
                            <div className={styles.attributes}>
                                <p className={styles.name}>{film.name}</p>
                                <p className={styles.view}>Lượt xem: {film.views}</p>
                            </div>
                        </Link>
                    );
                })
            }
        </div>
    );
}


export default List;