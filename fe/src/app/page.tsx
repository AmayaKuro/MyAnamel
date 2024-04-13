"use client";

import React, { useEffect } from "react";

import { useAlert } from "@utils/providers/alert";
import Banner from "@components/main/Banner";

import styles from "@css/main/Home.module.css";


const Home: React.FC = () => {
  const { dispatch: { setAlertMessage, setSeverity } } = useAlert();

  useEffect(() => {
    setAlertMessage("Hello");
    setSeverity("info");
  }, []);

  return (
    <div className={styles.main}>
        <Banner />
      <p>Fill this in the bottom</p>
    </div>
  );
}

export default Home;