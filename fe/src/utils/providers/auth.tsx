"use client";
import { useState, useMemo, useContext, createContext, Dispatch, SetStateAction, useEffect, useCallback } from "react";
import { BACKEND_URL } from "../env";


type AuthContextProps = {
    state: {
        accessToken: string | null;
    };
    dispatch: {
        setAccessToken: Dispatch<SetStateAction<string | null>>;
        /**
         * Return a fetch that add additional headers for authorization and backend address
         * @param relativePath 
         * @example "/film/popular"
         * @param options 
         * @returns 
         */
        BEfetch: (relativePath: string, options?: RequestInit) => Promise<Response>;
    };
}


export const AuthContext = createContext({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);


const Auth = ({ children }: {
    children: React.ReactNode
}) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    // console.log(accessToken)

    const BEfetch = useCallback(async (relativePath: string, options?: RequestInit) => {
        return fetch(BACKEND_URL + relativePath, {
            ...options,
            headers: {
                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                ...(options ? options.headers : {}),
            },
        });
    }, [accessToken]);

    // Use memo to prevent unnecessary re-render for the Provider
    const value = useMemo(() => ({
        state: {
            accessToken: accessToken,
        },
        dispatch: { setAccessToken, BEfetch },
    }), [accessToken, BEfetch]);

    useEffect(() => {
        // Check for access token initially
        var ac_to = window.localStorage.getItem("ac_to");
        setAccessToken(ac_to);

        // Listen for changes in local storage
        const listenStorageChange = () => {
            ac_to = window.localStorage.getItem("ac_to");
            setAccessToken(ac_to);
        };

        window.addEventListener("storage", listenStorageChange);
        return () => window.removeEventListener("storage", listenStorageChange);
    });

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export default Auth;
