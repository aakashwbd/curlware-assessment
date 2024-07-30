import { Link } from "@inertiajs/react";
import { Anchor, Avatar, Box, Card, Grid, Skeleton, Text } from "@mantine/core";
import React from "react";
import { useFetchSiteCategoriesQuery } from "../../../store/api/slices/siteSlice";
import { imageUrlBuilder } from "../../../utils/Helpers";
import PageHeader from "../shared/PageHeader";

const FeatureCategories = () => {
    const { isFetching, data } = useFetchSiteCategoriesQuery(
        `page=1&offset=8&fields=slug,name,attachments&is_featured=1`
    );

    return (
        <Box>
            <PageHeader label="Featured Categories" url="/categories" />
            {isFetching ? (
                <Grid>
                    {Array(8)
                        .fill(1)
                        ?.map((_, i) => (
                            <Grid.Col span={{ base: 12, lg: 12 / 8 }} key={i}>
                                <Card withBorder p="xs">
                                    <Skeleton h={150} mb="xs" />
                                    <Skeleton h={30} />
                                </Card>
                            </Grid.Col>
                        ))}
                </Grid>
            ) : (
                <Grid>
                    {data?.data?.map((item, i) => (
                        <Grid.Col span={{ base: 12, lg: 12 / 8 }} key={i}>
                            <Card withBorder p="xs">
                                <Avatar
                                    src={imageUrlBuilder(item?.attachments)}
                                    w="100%"
                                    h={150}
                                    radius="sm"
                                    mb="xs"
                                />
                                <Text
                                    truncate
                                    w="100%"
                                    size="sm"
                                    ta="center"
                                    className="font-primary !font-semibold"
                                >
                                    <Anchor
                                        fw={500}
                                        component={Link}
                                        c="#9C82BF"
                                        href={`/products?category=${item?.slug}`}
                                    >
                                        {item?.name}
                                    </Anchor>
                                </Text>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
        </Box>
    );
};

export default FeatureCategories;
