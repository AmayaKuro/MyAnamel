"use client";

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

import Tab from '@mui/material/Tab';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import DnsIcon from '@mui/icons-material/Dns';

import styles from "@css/component/filmInfo/Details.module.css";
import { Button } from '@mui/material';


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


const FilmDetail: React.FC<{ film: FilmProps }> = ({ film }) => {
    const [tabValue, setTabValue] = React.useState("episodes");

    return (
        <TabContext value={tabValue}>
            <div className={"container " + styles.container}>
                <TabList
                    className={styles.selections}
                    onChange={(event, newValue) => setTabValue(newValue)}
                    aria-label="Platform"
                >
                    <Tab label="Tập phim" value="episodes" />
                    <Tab label="Mô tả" value="description" />
                    <Tab label="Thể loại" value="categories" />
                </TabList>

                <TabPanel className={styles.episodeContainer} value="episodes">
                    {film.episodes.map((server) => {
                        return (
                            <div key={server.serverName}>
                                <h3>{server.serverName}</h3>
                                <div className={styles.episodes} >
                                    {server.data.map((episode, index) => {
                                        return (
                                            <Button href={`/phim/${film.slug}/${episode.slug}`} key={"episode" + index}>
                                                {episode.name ? episode.name : episode.slug}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </TabPanel>
                <TabPanel value="description">
                    <div className={styles.description} dangerouslySetInnerHTML={{ __html: film.description }} />
                </TabPanel>
                <TabPanel className={styles.categories} value="categories" >
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
                </TabPanel>
            </div>
        </TabContext>
    );
};

export default FilmDetail;