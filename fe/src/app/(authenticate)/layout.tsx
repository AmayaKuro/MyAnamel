"use client";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';


export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    // Check if user is logged in
    // useEffect(() => {
    //     if (session) {
    //         router.push('/chats')
    //     }
    // }, [session])

    return (
        <>
            {children}
        </>
    )
}