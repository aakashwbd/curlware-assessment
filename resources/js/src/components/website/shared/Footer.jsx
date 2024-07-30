import { Box, Center, Container, Text } from "@mantine/core";
import React from "react";

const Footer = () => {
    return (
        <Box bg="white" py="sm">
            <Container size="xl">
                <Text ta="center" size="sm" c="dimmed">
                    &copy; All rights has been reserved.
                </Text>
            </Container>
        </Box>
    );
};

export default Footer;
