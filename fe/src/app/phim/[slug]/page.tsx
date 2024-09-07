"use client";

import React, { use, useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';

import Overview from '@/components/filmInfo/Overview';
import Details from '@/components/filmInfo/Details';

import { useAlert } from '@utils/providers/alert';
import { useAuth } from '@/utils/providers/auth';
import type { FilmProps, ErrorProps, BEResponse } from '@utils/types';

import styles from "@css/app/filmInfo.module.css";


interface RouteParams {
    params: {
        slug: string;
    }
}


const FilmDetail: React.FC<RouteParams> = ({ params: { slug } }) => {
    const { dispatch: { setAlertMessage, setSeverity } } = useAlert();
    const { dispatch: { BEfetch } } = useAuth();

    const [film, setFilm] = useState<FilmProps>({
        _id: "",
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
    const [following, setFollowing] = useState(false);
    const [error, setError] = useState<ErrorProps | null>(null);

    const followManage = useCallback(() => {
        if (!film._id) return;

        BEfetch(`/film/follow`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                filmSlug: film.slug,
                action: following ? "unfollow" : "follow",
            }),
        }).then((res) => {
            if (res.status === 200) {
                setFollowing(!following);
            } else {
                setAlertMessage("Failed to follow/unfollow the film");
                setSeverity("error");
            }
        });
    }, [film]);

    const followUtils = useMemo(() => ({
        following,
        followManage,
    }), [following, followManage]);

    useEffect(() => {
        BEfetch(`/film/${slug}`)
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
        if (!film._id) return;

        BEfetch(`/user/follow/${film.slug}`)
            .then((res) => setFollowing(res.status === 200))
        // .then((res: BEResponse) => {
        //     if (res.statusCode >= 400) {
        //         throw res;
        //     }

        //     setFollowing(res.data.following);
        // }).catch((err) => {
        //     setError(err);
        // });
    }, [film]);

    useEffect(() => {
        if (!error) return;

        throw error;
    }, [error]);


    return (
        <div className={styles.main}>
            <Overview film={film} followUtils={followUtils} />
            <Details film={film} />

            <div className={styles.moreFilm}>

            </div>

        </div>
    );
};

export default FilmDetail;