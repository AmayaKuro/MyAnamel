"use client"
import Link from 'next/link'
import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { type passwordStrengthOutput, passwordChecker } from '@utils/authenticate/password'
import { TextField, LinearProgress } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import { motion } from "framer-motion";

import { useAuth } from '@/utils/providers/auth'
import { BEResponse } from '@/utils/types'

import styles from '@css/app/Authenticate.module.css'

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState({
        username: '',
        password: '',
        extra: '',
    });
    const [loading, setLoading] = useState(false);

    const { dispatch: { BEfetch } } = useAuth();

    const router = useRouter();

    const strength = useMemo((): passwordStrengthOutput =>
        passwordChecker(password), [password])

    const addError = useCallback((key: string, value: string) => {
        setError((errors) => {
            return {
                ...errors,
                [key]: value,
            }
        })
    }, [])


    const register = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setLoading(true);
        try {
            const response = await BEfetch(`/user/register`, {
                headers: {
                    "Content-Type": "application/json",
                },
                method: 'POST',
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });

            const res: BEResponse = await response.json();

            if (res.statusCode === 400) {
                for (const key in res.data) {
                    addError(key, res.data[key]);
                }
                setLoading(false);
                return;
            } else if (res.statusCode === 200) {
                // Set token and redirect to home page if success
                window.localStorage.setItem('ac_to', res.data.ac_to);
                // Trigger storage event to update the context (storage event doesn't trigger on the same page) 
                window.dispatchEvent(new Event("storage"));

                router.push('/');
                setLoading(false);
            }
        }
        catch (e) {
            addError('extra', 'Unable to register');
            setLoading(false);
        }
    }, [username, password, password2, addError])


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.title}>
                        <h2>Register</h2>
                    </div>
                    <form onSubmit={(e) => register(e)}>
                        <div className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="username">Username:</label>
                                <TextField
                                    type="text"
                                    name="username"
                                    placeholder="Username"
                                    id="username"
                                    value={username}
                                    onChange={e => {
                                        setUsername(e.target.value)
                                        setError((errors) => {
                                            return {
                                                ...errors,
                                                username: '',
                                            }
                                        })
                                    }}
                                    {...(error.username !== "" && { error: true, helperText: error.username })}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="password">Password:</label>
                                <TextField
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    id="password"
                                    color={strength.color}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <div className={styles.strength}>
                                    <p>Strength: {strength.text}</p>
                                    <LinearProgress color={strength.color} variant="determinate" value={strength.score * 25} style={{ borderRadius: "3px" }} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="re-password">Type password again:</label>
                                <TextField
                                    type="password"
                                    name="password2"
                                    placeholder="Re-Password"
                                    id="re-password"
                                    value={password2}
                                    onChange={e => setPassword2(e.target.value)}
                                    {...(password !== ""
                                        && password2 !== ""
                                        && password !== password2
                                        && { error: true, helperText: "Passwords do not match" }
                                    )}
                                />
                            </div>
                            {error.extra !== "" && <div className={styles.formGroup} style={{ color: "#f53e3e" }}>
                                {error.extra}
                            </div>}
                            <LoadingButton
                                type="submit"
                                className={styles.formGroup}
                                loading={loading}
                                disabled={!username || !!error.username || !password || !password2 || strength.score < 3 || password !== password2}
                            >
                                Register
                            </LoadingButton>
                        </div>
                    </form>
                    <div className={styles.footer}>
                        <p>
                            Already has an account?
                        </p>
                        <p>
                            Login <Link href="/login">here</Link>
                        </p>
                    </div>
                </div>
            </main>
        </motion.div>
    )
}