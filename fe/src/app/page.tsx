"use client";

import React, { useEffect, useState } from "react";

import Banner from "@components/main/Banner";
import Slider from "@components/main/Slider";
import List from "@components/main/List";

import { useAlert } from "@utils/providers/alert";
import { BACKEND_URL } from "@utils/env";
import { ExtendedFilmDisplayProps, ErrorResponse } from "@utils/types";

import styles from "@css/app/Home.module.css";


const Home: React.FC = () => {
  const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

  const [films, setFilms] = useState<ExtendedFilmDisplayProps[]>([]);
  const [error, setError] = useState<ErrorResponse | null>(null);

  useEffect(() => {
    setAlertMessage("Hello");
    setSeverity("info");
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/film/new`)
      .then((res) => res.json())
      .then((films: ExtendedFilmDisplayProps[]) => {
        setFilms(films);
      }).catch((err) => {
        setAlertMessage("Failed to fetch films! " + "Reason: " + err.message);
        setSeverity("error");
      });
  }, []);


  return (
    <div className={styles.main}>
      <Banner films={films} />
      <h2 style={{ textAlign: "center" }}>Maybe for categories display</h2>
      <Slider films={films} />
      <h2 style={{ textAlign: "center" }}>Or list just a bunch of things</h2>
      <List films={films} />

    </div>
  );
}

export default Home;