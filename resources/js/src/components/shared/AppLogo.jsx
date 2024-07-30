import { Link } from "@inertiajs/react";
import { Anchor, Box, Image } from "@mantine/core";
import React from "react";
import { images } from "../../constants/images";

const AppLogo = ({ w = 140, h = 40, src = null, navigateTo = "/" }) => {
    return (
        <Box w={w} h={h}>
            <Anchor component={Link} display="inline-block" href={navigateTo}>
                <Image
                    src={src ? src : images._244x40}
                    w="100%"
                    h="100%"
                    alt="App Logo"
                    radius="xs"
                />
            </Anchor>
        </Box>
    );
};

export default AppLogo;
