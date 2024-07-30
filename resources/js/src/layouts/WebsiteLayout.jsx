import { AppShell } from "@mantine/core";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Footer from "../components/website/shared/Footer";
import Header from "../components/website/shared/Header";
import { setCurrentUser } from "../store/reducers/authReducer";

const WebsiteLayout = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        let currentUser = Cookies.get("user") || null;
        if (currentUser) {
            dispatch(setCurrentUser(JSON.parse(currentUser)));
        }
    }, []);
    return (
        <AppShell header={{ height: 120 }}>
            <AppShell.Header>
                <Header />
            </AppShell.Header>
            <AppShell.Main>
                <div className="min-h-screen py-4">{children}</div>
                <Footer />
            </AppShell.Main>
        </AppShell>
    );
};

export default WebsiteLayout;
