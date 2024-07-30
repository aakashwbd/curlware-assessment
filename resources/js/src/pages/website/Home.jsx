import { Container, Flex } from "@mantine/core";
import React from "react";
import FeatureCategories from "../../components/website/Home/FeatureCategories";
import FeatureProducts from "../../components/website/Home/FeatureProducts";
import Sliders from "../../components/website/Home/Sliders";
import WebsiteLayout from "../../layouts/WebsiteLayout";

const Home = () => {
    return (
        <Container size="xl">
            <Flex direction="column" gap="xl">
                <Sliders />
                <FeatureCategories />
                <FeatureProducts />
            </Flex>
        </Container>
    );
};

Home.layout = (page) => <WebsiteLayout children={page} />;
export default Home;
