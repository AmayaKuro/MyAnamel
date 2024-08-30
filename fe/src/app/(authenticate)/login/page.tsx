"use client"
import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import { TextField } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import LoadingButton from '@mui/lab/LoadingButton'
import { motion } from "framer-motion";

import { BEResponse } from '@/utils/types'
import { BACKEND_URL } from '@/utils/env'

import styles from '@css/app/Authenticate.module.css'

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const router = useRouter()

    const login = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Prevent empty fields
        if (!username || !password) {
            setError('Tài khoản hoặc mật khẩu không được để trống!');
            return;
        }

        setError('');
        setLoading(true);

        const response = await fetch(`${BACKEND_URL}/user/login`, {
            headers: {
                "Content-Type": "application/json",
                "credentials": "same-origin",
            },
            method: 'POST',
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });

        const res: BEResponse = await response.json();

        if (res.statusCode === 400) {
            setError(res.data?.username || res.data?.password || "Đã xảy ra lỗi, vui lòng thử lại sau!");
            setLoading(false);
        }
        else {

            // Set token and redirect to home page if success
            window.localStorage.setItem('token', res.data.ac_to);

            setLoading(false);
            router.push('/');
        }
    }, [username, password])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>Đăng nhập</h2>
                    </div>
                    <form onSubmit={login}>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Tên tài khoản:</label>
                                <TextField type="text" name="username" placeholder="bkav@123, ..." className={styles.formInput} id="username" value={username} onChange={e => setUsername(e.target.value)} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Mật Khẩu:</label>
                                <TextField
                                    type="password"
                                    name="password"
                                    placeholder="Mât khẩu"
                                    className={styles.formInput}
                                    id="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </div>
                            {error !== "" && <div className={styles.formGroup} style={{ color: "#f53e3e" }}>
                                {error}
                            </div>}
                            <LoadingButton
                                className={styles.formGroup}
                                type="submit"
                                loading={loading}
                                disabled={!username || !password}>
                                Đăng nhập
                            </LoadingButton>
                        </div>
                    </form>
                    <div className={styles.footer}>
                        <p>
                            Không có tài khoản?
                        </p>
                        <p>
                            Đăng kí <Link href="/register">tại đây</Link>
                        </p>
                    </div>
                    {/* <div className={styles.social}>
                        <hr style={{ minWidth: "80%" }} />
                        <p>
                            Or log in with
                        </p>

                        <IconButton onClick={() => OAuthLogin("google")}>
                            <Image
                                src="https://authjs.dev/img/providers/google.svg"
                                width={30}
                                height={30}
                                alt="Google"
                            />
                        </IconButton>
                    </div> */}
                </div>
            </main>
        </motion.div>
    )
}