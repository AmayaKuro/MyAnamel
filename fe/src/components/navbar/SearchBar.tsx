"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import { redirect, useRouter } from "next/navigation";

import Input from '@mui/material/Input';
import IconButton from "@mui/material/IconButton";
import SearchIcon from '@mui/icons-material/Search';

import styles from "@css/component/navbar/SearchBar.module.css";


type RecommendationProps = {

}


const SearchBar: React.FC = () => {
    const [message, setMessage] = useState("");
    const [recommendations, setRecommendations] = useState<RecommendationProps>([]);

    const router = useRouter();

    useEffect(() => {
        if (message === "") return;

        const payload = {
            message: message,
        };

        fetch(`/conversation`, {
            method: "GET",
            body: JSON.stringify(payload),
        })
            .then((res) => res.json())
            .then((data: RecommendationProps[]) => setRecommendations(data))
            .catch((err) => console.error(err));
    }, [message]);


    return (
        <>
            <Input
                value={message}
                placeholder="Type an anime's name"
                className={styles.input}
                autoComplete="true"
                onChange={(e) => setMessage(e.currentTarget.value)}
                onKeyDown={(e) => {
                    // Send the message if the user press enter
                    if (e.key === "Enter") {
                        e.preventDefault();
                        // Prevent the user from sending empty message 
                        if (message !== "") {
                            redirect(`/search?query=${message}`);
                        }
                    }
                }}
            />
            <IconButton
                className={styles.submitButton}
                onClick={() => redirect(`/search?query=${message}`)}
                disabled={message === ""}
            >
                <SearchIcon />
            </IconButton>
        </>

    )
}

export default SearchBar;