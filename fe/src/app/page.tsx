"use client";

import React, { useEffect } from "react";

import { useAlert } from "@utils/providers/alert";
import Banner from "@components/main/Banner";
import Section from "@components/main/Section";

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
      <h2 style={{ textAlign: "center" }}>Maybe for categories display</h2>
      <Section />
    </div>
  );
}

export default Home;