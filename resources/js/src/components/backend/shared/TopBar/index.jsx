import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionIcon, Box, Burger, Grid, Group } from "@mantine/core";
import React from "react";
import { useSelector } from "react-redux";
import FullScreen from "../../../shared/FullScreen";
import Skin from "../../../shared/Skin";
import ProfileBox from "./ProfileBox";

const TopBar = ({
    desktopOpened = true,
    mobileOpened = false,
    toggleMobile = () => {},
    toggleDesktop = () => {},
}) => {
    const { skin } = useSelector((state) => state.site);
    return (
        <Box
            w="100%"
            h="100%"
            {...(skin === "light" && { bg: "white" })}
            py="xs"
            px="lg"
            className="shadow-sm"
        >
            <Grid align="center">
                <Grid.Col span={1}>
                    <Burger
                        size="sm"
                        opened={mobileOpened}
                        onClick={toggleMobile}
                        hiddenFrom="sm"
                    />
                    <ActionIcon
                        visibleFrom="sm"
                        onClick={toggleDesktop}
                        variant="default"
                        radius="sm"
                    >
                        <Icon
                            icon="material-symbols-light:menu-open-rounded"
                            fontSize={22}
                        />
                    </ActionIcon>
                </Grid.Col>
                <Grid.Col span={11}>
                    <Group gap="xs" justify="end">
                        <Skin />
                        <FullScreen />
                        <ProfileBox />
                    </Group>
                </Grid.Col>
            </Grid>
        </Box>
    );
};

export default TopBar;
