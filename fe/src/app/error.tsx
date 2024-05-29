"use client";
import React from 'react';

import Image from 'next/image';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

import type { ErrorResponse } from '@utils/types';

import styles from "@css/app/Error.module.css";


interface ErrorProps {
    error: ErrorResponse;
    reset: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, reset }) => {
    return (
        <div className={styles.container}>
            <Image className={styles.image} src="/error.jpg" alt="Error" width={200} height={200} />
            <div className={styles.description}>
                <div className={styles.statusCode}>{error.statusCode || 500}</div>
                <div>{error.message}</div>
            </div>

            <Button href="/" startIcon={<ArrowBackIosNewIcon />}> Go back to home page</Button>
        </div>
    );
};

export default Error;