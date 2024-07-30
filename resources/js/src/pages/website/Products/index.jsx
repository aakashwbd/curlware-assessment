import {
    Box,
    Card,
    Checkbox,
    Container,
    Flex,
    Grid,
    Group,
    Pagination,
    RangeSlider,
    rem,
    Skeleton,
    Slider,
    Stack,
    Text,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import ProductItem from "../../../components/website/shared/ProductItem";
import WebsiteLayout from "../../../layouts/WebsiteLayout";
import {
    useFetchSiteCategoriesQuery,
    useFetchSiteProductsQuery,
} from "../../../store/api/slices/siteSlice";
import { paramsChangeHandler } from "../../../utils/Helpers";
import { Icon } from "@iconify/react/dist/iconify.js";

const Product = () => {
    let categoryParam = new URLSearchParams(window.location.search).get(
        "category"
    );
    let searchParam = new URLSearchParams(window.location.search).get("search");

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
        price_range: null,
        category_ids: [],
    });

    const { isFetching, data } = useFetchSiteProductsQuery(
        `page=${params.page}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }${
            params?.category_ids?.length
                ? `&category_ids=${params?.category_ids}`
                : ""
        }&fields=id,slug,name,discount_properties,discount_price,regular_price,attachments&status=active`,
        {
            refetchOnMountOrArgChange: true,
        }
    );

    const { isFetching: isCategoryFetching, data: categories } =
        useFetchSiteCategoriesQuery(
            `get_all=1&children=1&fields=id,slug,name&relations[]=children:id,parent_id,name,slug`
        );

    const checkHandler = (value, checked) => {
        let payload = [...params.category_ids];
        if (checked) {
            payload.push(value);
        } else {
            payload = payload.filter((item) => item !== value);
        }
        setParams((prevState) => ({
            ...prevState,
            category_ids: payload,
        }));
    };

    useEffect(() => {
        if (categoryParam && categories?.length) {
            let categoryId;
            categories.find((item) => {
                if (item?.slug === categoryParam) {
                    categoryId = item?.id;
                    return true;
                }
                const child = item?.children?.find(
                    (cItem) => cItem?.slug === categoryParam
                );
                if (child) {
                    categoryId = child?.id;
                    return true;
                }
                return false;
            });

            setParams((prevState) => ({
                ...prevState,
                category_ids: [categoryId],
            }));
        }
    }, [categoryParam, categories]);

    useEffect(() => {
        if (searchParam) {
            setParams((prevState) => ({
                ...prevState,
                search: searchParam,
            }));
        }
    }, [searchParam]);

    return (
        <Container size="xl">
            <Grid>
                <Grid.Col span={{ base: 12, lg: 3 }}>
                    <Card withBorder>
                        <Card.Section inheritPadding withBorder py="xs">
                            <Text size="sm" c="#9C82BF">
                                Category
                            </Text>
                        </Card.Section>
                        <Card.Section inheritPadding withBorder py="xs">
                            {isCategoryFetching
                                ? Array(20)
                                      .fill(1)
                                      .map((_, i) => (
                                          <Skeleton h={20} key={i} mb="xs" />
                                      ))
                                : categories?.map((item, i) =>
                                      item?.children?.length ? (
                                          <Box key={i}>
                                              <Checkbox
                                                  label={item?.name}
                                                  c="#9C82BF"
                                                  fw={600}
                                                  mb="xs"
                                                  size="xs"
                                                  color="#9C82BF"
                                                  onChange={(e) =>
                                                      checkHandler(
                                                          item?.id,
                                                          e.target.checked
                                                      )
                                                  }
                                                  checked={params.category_ids?.some(
                                                      (cItem) =>
                                                          cItem === item?.id
                                                  )}
                                              />
                                              {item?.children?.map(
                                                  (cItem, cI) => (
                                                      <Checkbox
                                                          label={cItem?.name}
                                                          c="dimmed"
                                                          key={cI}
                                                          ml="xl"
                                                          mb="xs"
                                                          size="xs"
                                                          color="#9C82BF"
                                                          onChange={(e) =>
                                                              checkHandler(
                                                                  cItem?.id,
                                                                  e.target
                                                                      .checked
                                                              )
                                                          }
                                                          checked={params.category_ids?.some(
                                                              (sItem) =>
                                                                  sItem ===
                                                                  cItem?.id
                                                          )}
                                                      />
                                                  )
                                              )}
                                          </Box>
                                      ) : (
                                          <Checkbox
                                              label={item?.name}
                                              c="#9C82BF"
                                              key={i}
                                              mb="xs"
                                              fw={600}
                                              size="xs"
                                              color="#9C82BF"
                                              onChange={(e) =>
                                                  checkHandler(
                                                      item?.id,
                                                      e.target.checked
                                                  )
                                              }
                                              checked={params.category_ids?.some(
                                                  (cItem) => cItem === item?.id
                                              )}
                                          />
                                      )
                                  )}
                        </Card.Section>
                    </Card>
                    {/* {priceRange?.length && range?.length ? (
                        <Box className="border rounded" p="xs">
                            <Text mb="xs">Price range</Text>
                            <RangeSlider
                                styles={{
                                    thumb: {
                                        borderWidth: rem(2),
                                        padding: rem(3),
                                    },
                                }}
                                color="#9C82BF"
                                defaultValue={[6000, 20000]}
                                onChange={(value) => {
                                    paramsChangeHandler(
                                        "price_range",
                                        value,
                                        setParams
                                    );
                                }}
                                // min={6000}
                                // max={20000}
                            />
                        </Box>
                    ) : (
                        ""
                    )} */}
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 9 }}>
                    {data?.data?.length ? (
                        <>
                            <Grid>
                                {data?.data?.map((item, i) => (
                                    <Grid.Col
                                        span={{ base: 6, sm: 4, md: 3 }}
                                        key={i}
                                    >
                                        <ProductItem data={item} />
                                    </Grid.Col>
                                ))}
                            </Grid>
                            <Group my="xl" justify="center">
                                <Pagination
                                    size="sm"
                                    total={data?.last_page}
                                    value={params?.page}
                                    onChange={(value) =>
                                        paramsChangeHandler(
                                            "page",
                                            value,
                                            setParams
                                        )
                                    }
                                    color="#9C82BF"
                                    radius="xl"
                                />
                            </Group>
                        </>
                    ) : (
                        <Flex align="center" direction="column">
                            <Icon
                                icon="tabler:mood-empty"
                                fontSize={56}
                                color="gray"
                            />
                            <Text size="sm" mt="xs" c="dimmed">
                                Sorry, No data found.
                            </Text>
                        </Flex>
                    )}
                </Grid.Col>
            </Grid>
        </Container>
    );
};

Product.layout = (page) => <WebsiteLayout children={page} />;
export default Product;
