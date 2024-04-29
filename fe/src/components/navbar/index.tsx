"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

import SearchBar from "./SearchBar";
import Options from "./Options";

import styles from "@css/component/navbar/Navbar.module.css";


const Navbar: React.FC = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [open, setOpen] = useState(true);


    useEffect(() => {
        // Set default state 
        setIsMobile(window.innerWidth < 600);

        // add event listener to window 
        const handleWindowResize = () => setIsMobile(window.innerWidth < 600);

        window.addEventListener("resize", handleWindowResize);

        return () => window.removeEventListener("resize", handleWindowResize);
    }, []);


    return (
        <nav className={styles.navbar}>
            <div className={styles.start}>
                <Link href="/" className={styles.logo}>
                    NOT NOW
                </Link>
            </div>
            {
                !isMobile && <div className={styles.center}>
                    <SearchBar />
                </div>
            }

            <div className={styles.end}>
                {
                    isMobile && <IconButton
                        title="Search"
                        className={styles.searchButton}
                        size="medium"
                        children={<SearchIcon fontSize="medium" />}
                    />
                }

                <Options />
            </div>
        </nav>
    )
}

export default Navbar;

