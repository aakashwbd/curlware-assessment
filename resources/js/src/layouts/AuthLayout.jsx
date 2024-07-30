import { BackgroundImage, Box, Card, Center, Flex, Image } from "@mantine/core";
import React from "react";
import { images } from "../constants/images";

const AuthLayout = ({ children }) => {
    return (
        <BackgroundImage w="100%" h="100%" mih="100vh" src={images.AUTH_BG}>
            <Box
                bg="white"
                w={{ base: "100%", lg: "50%" }}
                h="100%"
                mih="100vh"
                className="flex flex-col justify-center items-center rounded-r-xl"
                p="xs"
            >
                {children}
            </Box>
        </BackgroundImage>
    );
};

export default AuthLayout;
