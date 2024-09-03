"use client";
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

import { useAuth } from '@/utils/providers/auth'

export default function AuthenticationLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const params = useSearchParams();

    const { state: { accessToken } } = useAuth();

    // If user is logged in, redirect to the main page
    useEffect(() => {
        if (accessToken) {
            router.push(params.get("redirect") ?? "/");
        }
    }, [accessToken])

    return (
        <>
            {children}
        </>
    )
}