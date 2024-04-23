"use client";
import React, { useState } from "react";

import Link from "@mui/material/Link";
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import styles from "@css/navbar/Options.module.css";


const Options: React.FC = () => {
    const [isLogged, setIsLogged] = useState(false);

    return (
        <>
            <IconButton title="More" size="large" children={<MoreHorizIcon fontSize="medium" />} />
            {isLogged
                ? <IconButton
                    title="Account"
                    size="medium"
                    children={<AccountCircleIcon fontSize="medium" />}
                    onClick={() => setIsLogged(false)}
                />
                : <Link href="/login" onClick={(e) => {
                    e.preventDefault();
                    setIsLogged(true);
                }}>
                    <Button variant="contained" color="primary">Login</Button>
                </Link>
            }
        </>
    );
};

export default Options;