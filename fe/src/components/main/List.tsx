"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { FilmDisplayProps } from "@utils/types";
import { BACKEND_URL } from "@utils/env";
import { useAlert } from "@utils/providers/alert";

import styles from "@css/component/main/List.module.css";


interface ComponentProps {
    films: FilmDisplayProps[];
}


const List: React.FC<ComponentProps> = ({ films }) => {

    return (
        <div className={"container " + styles.container}>
            {
                films.map((film, index) => {
                    return (
                        <Link href={`/phim/${film.slug}`} key={film.slug} className={styles.film}>
                            <Image src={film.thumbnail} alt={film.name} width={215} height={325} loading="lazy" />
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