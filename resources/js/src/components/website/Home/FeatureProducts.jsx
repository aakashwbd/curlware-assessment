import { Box, Card, Flex, Grid, Skeleton } from "@mantine/core";
import React from "react";
import { useFetchSiteProductsQuery } from "../../../store/api/slices/siteSlice";
import PageHeader from "../shared/PageHeader";
import ProductItem from "../shared/ProductItem";

const FeatureProducts = () => {
    const { isFetching, data } = useFetchSiteProductsQuery(
        "page=1&offset=8&fields=id,slug,name,discount_properties,discount_price,regular_price,attachments&is_featured=1&status=active"
    );

    return (
        <Box>
            <PageHeader label="Featured Products" url="/products" />
            {isFetching ? (
                <Grid>
                    {Array(10)
                        .fill(1)
                        .map((_, i) => (
                            <Grid.Col span={{ base: 12, lg: 12 / 5 }} key={i}>
                                <Card withBorder p="sm" radius="md">
                                    <Card.Section inheritPadding py="md">
                                        <Skeleton h={180} />
                                    </Card.Section>
                                    <Skeleton h={30} mb="sm" />
                                    <Flex gap="xs">
                                        <Skeleton h={30} />
                                        <Skeleton h={30} />
                                    </Flex>
                                </Card>
                            </Grid.Col>
                        ))}
                </Grid>
            ) : (
                <Grid>
                    {data?.data?.map((item, i) => (
                        <Grid.Col
                            span={{ base: 6, sm: 4, md: 3, lg: 12 / 5 }}
                            key={i}
                        >
                            <ProductItem data={item} />
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FeatureProducts;
