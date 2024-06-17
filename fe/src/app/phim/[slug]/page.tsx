"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import Overview from '@/components/filmInfo/Overview';
import Details from '@/components/filmInfo/Details';

import { useAlert } from '@utils/providers/alert';
import { BACKEND_URL } from '@utils/env';
import type { FilmProps, ErrorProps, BEResponse } from '@utils/types';

import styles from "@css/app/filmInfo.module.css";


interface RouteParams {
    params: {
        slug: string;
    }
}


const FilmDetail: React.FC<RouteParams> = ({ params: { slug } }) => {
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

    const [film, setFilm] = useState<FilmProps>({
        slug: "",
        name: "",
        originName: "Never Gonna Give You Up",
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
        episodes: []
    });
    const [error, setError] = useState<ErrorProps | null>(null);


    useEffect(() => {
        fetch(`${BACKEND_URL}/film/${slug}`)
            .then((response) => response.json())
            .then((res: BEResponse) => {
                if (res.statusCode >= 400) {
                    throw (res);
                }
                
                setFilm(res.data as FilmProps);
            }).catch((err) => {
                setError(err);
            });
    }, []);

    useEffect(() => {
        if (!error) return;

        throw error;
    }, [error]);


    return (
        <div className={styles.main}>
            <Overview film={film} />
            <Details film={film} />

            <div className={styles.moreFilm}>

            </div>

        </div>
    );
};

export default FilmDetail;