import {
    Anchor,
    Box,
    Card,
    Container,
    Flex,
    Grid,
    Group,
    Image,
    Pagination,
    Skeleton,
    Text,
} from "@mantine/core";
import React, { useState } from "react";
import WebsiteLayout from "../../layouts/WebsiteLayout";
import { useFetchSiteCategoriesQuery } from "../../store/api/slices/siteSlice";
import { imageUrlBuilder, paramsChangeHandler } from "../../utils/Helpers";
import { Link } from "@inertiajs/react";

const Categories = () => {
    const [params, setParams] = useState({ page: 1, offset: 12 });
    const { isFetching, data } = useFetchSiteCategoriesQuery(
        `page=${params.page}&offset=${params.offset}&children=1&fields=id,slug,name,attachments&relations[]=children:id,parent_id,name,slug`
    );
    return (
        <Container size="xl">
            <Text size="lg" fw={600} ta="center" mb="xs">
                All Categories
            </Text>

            {isFetching ? (
                <Grid>
                    {Array(12)
                        .fill(1)
                        .map((_, i) => (
                            <Grid.Col span={{ base: 12, lg: 6 }} key={i}>
                                <Card withBorder>
                                    <Flex gap="xs">
                                        <Skeleton w={60} h={60} />
                                        <Box w="100%">
                                            <Skeleton w="50%" h={20} mb="xs" />
                                            <Skeleton w={100} h={20} />
                                        </Box>
                                    </Flex>
                                </Card>
                            </Grid.Col>
                        ))}
                </Grid>
            ) : (
                <Grid>
                    {data?.data?.map((item, i) => (
                        <Grid.Col span={{ base: 12, lg: 6 }} key={i}>
                            <Card withBorder radius="sm">
                                <Group>
                                    <div>
                                        <Image
                                            w={60}
                                            h={60}
                                            src={imageUrlBuilder(
                                                item?.attachments
                                            )}
                                        />
                                    </div>
                                    <Box>
                                        <Anchor
                                            fw={600}
                                            size="md"
                                            display="block"
                                            c="#9C82BF"
                                            component={Link}
                                            href={`/product?category=${item?.slug}`}
                                        >
                                            {item?.name}
                                        </Anchor>
                                        <Group gap="xs">
                                            {item?.children?.map(
                                                (cItem, cI) => (
                                                    <Anchor
                                                        key={cI}
                                                        c="dimmed"
                                                        component={Link}
                                                        href={`/product?category=${cItem?.slug}`}
                                                    >
                                                        {cItem?.name}
                                                        {item?.children
                                                            ?.length -
                                                            cI >=
                                                        cI
                                                            ? ","
                                                            : ""}
                                                    </Anchor>
                                                )
                                            )}
                                        </Group>
                                    </Box>
                                </Group>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            )}
            <Group my="xl" justify="center">
                <Pagination
                    size="sm"
                    total={data?.last_page}
                    value={params?.page}
                    onChange={(value) =>
                        paramsChangeHandler("page", value, setParams)
                    }
                    radius="xl"
                    color="#9C82BF"
                />
            </Group>
        </Container>
    );
};
Categories.layout = (page) => <WebsiteLayout children={page} />;
export default Categories;
