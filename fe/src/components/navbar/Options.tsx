"use client";
import React, { useCallback, useEffect, useState } from "react";

import Link from "@mui/material/Link";
import IconButton from '@mui/material/IconButton';
import Button from "@mui/material/Button";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

import { useAuth } from "@/utils/providers/auth";

import styles from "@css/navbar/Options.module.css";


const Options: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const { state: { accessToken }, dispatch: { BEfetch } } = useAuth();

    useEffect(() => {
        // Set login status based on the presence of access token
        setIsLoggedIn(!!accessToken);
    }, [accessToken]);

    const logout = useCallback(() => {
        // Wait until the logout is complete before removing the token
        BEfetch(`/user/logout`, {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
        }).then(() => {
            window.localStorage.removeItem("ac_to");
            window.dispatchEvent(new Event("storage"));
        });
    }, [BEfetch]);

    return (
        <>
            <IconButton href="/user/theo-doi" title="More" size="large" children={<MoreHorizIcon fontSize="medium" />} />
            {isLoggedIn
                ? <IconButton
                    title="Account"
                    size="medium"
                    children={<AccountCircleIcon fontSize="medium" />}
                    onClick={() => logout()}
                />
                : <Button href="/login" variant="contained" color="primary">Login</Button>
            }
        </>
    );
};

export default Options;