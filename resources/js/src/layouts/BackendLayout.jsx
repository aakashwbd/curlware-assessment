import { AppShell, Box } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SideBar from "../components/backend/shared/SideBar";
import TopBar from "../components/backend/shared/TopBar";
import { setCurrentUser } from "../store/reducers/authReducer";

const BackendLayout = ({ children }) => {
    const dispatch = useDispatch();
    const { skin } = useSelector((state) => state.site);

    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

    useEffect(() => {
        let currentUser = Cookies.get("user") || null;
        if (currentUser) {
            dispatch(setCurrentUser(JSON.parse(currentUser)));
        } else {
            window.location.href = `${window.origin}/admin/login`;
        }
    }, []);

    return (
        <AppShell
            navbar={{
                width: "16rem",
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
        >
            <AppShell.Navbar top={0} h="100%" p="xs" bg="#232734">
                <SideBar toggle={toggleMobile} />
            </AppShell.Navbar>
            <AppShell.Main>
                <TopBar
                    mobileOpened={mobileOpened}
                    desktopOpened={desktopOpened}
                    toggleMobile={toggleMobile}
                    toggleDesktop={toggleDesktop}
                />
                <Box p="lg">{children}</Box>
            </AppShell.Main>
        </AppShell>
    );
};

export default BackendLayout;
