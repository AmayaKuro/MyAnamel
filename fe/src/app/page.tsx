"use client";

import React from "react";

import { useAlert } from "@/utils/providers/alert";


const Home: React.FC = () => {
  const { dispatch: { setAlertMessage, setSeverity} } = useAlert();

  setAlertMessage("Hello");

  return (
    <div>
      <h1>NOT NOW</h1>
    </div>
  );
}

export default Home;