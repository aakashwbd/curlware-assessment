import { Container, Grid, Group } from "@mantine/core";
import React from "react";
import AppLogo from "../../../shared/AppLogo";
import AuthBox from "./AuthBox";
import NavBar from "./NavBar";
import SearchBox from "./SearchBox";
import { images } from "../../../../constants/images";

const Header = () => {
    return (
        <>
            <Container size="xl" py="md">
                <Grid align="center" w="100%" h="100%">
                    <Grid.Col span={{ base: 4, lg: 2 }}>
                        <AppLogo
                            src={images._140x40}
                            w={140}
                            h={40}
                            navigateTo="/"
                        />
                    </Grid.Col>
                    <Grid.Col span={{ base: 2, lg: 6 }} visibleFrom="lg">
                        <SearchBox />
                    </Grid.Col>
                    <Grid.Col span={{ base: 8, lg: 4 }}>
                        <Group justify="end">
                            <AuthBox />
                        </Group>
                    </Grid.Col>
                </Grid>
            </Container>
            <NavBar />
        </>
    );
};

export default Header;
