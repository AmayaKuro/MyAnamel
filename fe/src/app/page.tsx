"use client";

import React, { useEffect } from "react";

import { useAlert } from "@utils/providers/alert";
import Banner from "@components/main/Banner";
import Slider from "@components/main/Slider";
import List from "@components/main/List";

import styles from "@css/app/Home.module.css";


const Home: React.FC = () => {
  const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

  useEffect(() => {
    setAlertMessage("Hello");
    setSeverity("info");
  }, []);

  return (
    <div className={styles.main}>
      <Banner />
      <h2 style={{ textAlign: "center" }}>Maybe for categories display</h2>
      <Slider />
      <h2 style={{ textAlign: "center" }}>Or list just a bunch of things</h2>
      <List />

    </div>
  );
}

export default Home;