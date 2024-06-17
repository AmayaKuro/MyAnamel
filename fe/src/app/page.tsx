"use client";

import React, { useEffect, useState } from "react";

import Banner from "@components/main/Banner";
import Slider from "@components/main/Slider";
import List from "@components/main/List";

import { useAlert } from "@utils/providers/alert";
import { BACKEND_URL } from "@utils/env";
import { ExtendedFilmDisplayProps, BEResponse, ErrorProps, FilmDisplayProps } from "@utils/types";

import styles from "@css/app/Home.module.css";


const Home: React.FC = () => {
  const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

  const [bannerFilms, setBannerFilms] = useState<ExtendedFilmDisplayProps[]>([]);
  // Films for the slider and list
  const [listFilms, setListFilms] = useState<FilmDisplayProps[]>([]);
  const [error, setError] = useState<ErrorProps | null>(null);

  useEffect(() => {
    setAlertMessage("Hello");
    setSeverity("info");
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/film/popular?extend=true`)
      .then((response) => response.json())
      .then((res: BEResponse) => {
        if (res.statusCode >= 400) {
          throw res;
        }

        setBannerFilms(res.data as ExtendedFilmDisplayProps[]);
      }).catch((err) => {
        setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
        setSeverity("error");
      });

    fetch(`${BACKEND_URL}/film/new`)
      .then((respsonse) => respsonse.json())
      .then((res: BEResponse) => {
        if (res.statusCode >= 400) {
          throw res;
        }

        setListFilms(res.data as FilmDisplayProps[]);
      }).catch((err) => {
        setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
        setSeverity("error");
      });
  }, []);


  return (
    <div className={styles.main}>
      <Banner films={bannerFilms} />
      <h2 style={{ textAlign: "center" }}>Maybe for categories display</h2>
      <Slider films={listFilms} />
      <h2 style={{ textAlign: "center" }}>Or list just a bunch of things</h2>
      <List films={listFilms} />

    </div>
  );
}

export default Home;