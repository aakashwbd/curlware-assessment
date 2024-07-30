import { router, usePage } from "@inertiajs/react";
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Container,
    Grid,
    Image,
    NumberFormatter,
    Skeleton,
    Table,
    Text,
    TypographyStylesProvider,
} from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TextBox from "../../../components/ui/TextBox";
import WebsiteLayout from "../../../layouts/WebsiteLayout";
import { useCreateCartMutation } from "../../../store/api/slices/cartSlice";
import { useFetchSiteProductQuery } from "../../../store/api/slices/siteSlice";
import { alertMessage, imageUrlBuilder } from "../../../utils/Helpers";

const Show = () => {
    const { props } = usePage();
    const { cartItems } = useSelector((state) => state.site);
    const { currentUser } = useSelector((state) => state.auth);
    const [quantity, setQuantity] = useState(1);
    const [isCart, setIsCart] = useState(false);

    const { isFetching, data: product } = useFetchSiteProductQuery(
        `${props.slug}?key=slug&fields=id,category_id,name,regular_price,discount_price,discount_properties,description,attachments&relations[]=category:id,name`,
        {
            skip: !props.slug,
            refetchOnMountOrArgChange: true,
        }
    );

    const [cart, result] = useCreateCartMutation();
    const cartHandler = async () => {
        if (currentUser) {
            let price =
                product?.discount_price > 0
                    ? product?.discount_price
                    : product?.regular_price;
            let { data, error } = await cart({
                product_id: product?.id,
                quantity: quantity,
                amount: Number(price) * Number(quantity),
            });

            if (data) {
                alertMessage({
                    title: data.message,
                    icon: "success",
                    timer: 1500,
                });
            } else if (error) {
                alertMessage({
                    title: error.message,
                    icon: "error",
                    timer: 2500,
                });
            }
        } else {
            router.visit("/login");
        }
    };

    useEffect(() => {
        if (cartItems && cartItems?.length) {
            setIsCart(
                cartItems?.some((item) => item?.product_id === product?.id)
            );
        } else {
            setIsCart(false);
        }
    }, [cartItems]);

    return (
        <Container size="xl">
            {isFetching ? (
                <Box>
                    <Grid>
                        <Grid.Col span={3}>
                            <Skeleton w="100%" h={400} />
                        </Grid.Col>
                        <Grid.Col span={9}>
                            <Skeleton w="100%" h={40} mb="xl" />
                            <Skeleton w="100%" h={40} mb="xl" />
                            <Skeleton w="100%" h={40} mb="xl" />
                            <Skeleton w="100%" h={40} mb="xl" />
                            <Skeleton w="100%" h={40} mb="xl" />
                            <Skeleton w="100%" h={40} mb="xl" />
                        </Grid.Col>
                    </Grid>
                    <Skeleton w="100%" h={40} mb="xs" />
                    <Skeleton w="100%" h={40} mb="xs" />
                    <Skeleton w="100%" h={40} mb="xs" />
                    <Skeleton w="100%" h={40} mb="xs" />
                </Box>
            ) : (
                <Box mt="xl">
                    <Grid mb="xl">
                        <Grid.Col span={{ base: 12, lg: 4 }}>
                            <Image
                                src={imageUrlBuilder(product?.attachments)}
                                w="100%"
                                h={500}
                                radius="sm"
                            />
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 8 }}>
                            <Text fw={600} mb="sm" c="#9C82BF">
                                {product?.name}
                            </Text>
                            <Table
                                w={{ base: "100%", lg: "50%" }}
                                withRowBorders={false}
                            >
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td fw={600} c="dimmed">
                                            Category
                                        </Table.Td>
                                        <Table.Td fw={600}>
                                            {product?.category?.name}
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Td fw={600} c="dimmed">
                                            Regular Price
                                        </Table.Td>
                                        <Table.Td fw={600}>
                                            <NumberFormatter
                                                value={product?.regular_price}
                                                thousandSeparator
                                                prefix="$"
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                    {product?.discount_price > 0 ? (
                                        <Table.Tr>
                                            <Table.Td fw={600} c="dimmed">
                                                Dicount Price
                                            </Table.Td>
                                            <Table.Td fw={600}>
                                                <NumberFormatter
                                                    value={
                                                        product?.discount_price
                                                    }
                                                    thousandSeparator
                                                    prefix="$"
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    ) : (
                                        ""
                                    )}

                                    <Table.Tr>
                                        <Table.Td fw={600} c="dimmed">
                                            Quantity
                                        </Table.Td>
                                        <Table.Td>
                                            <div className="border inline-flex rounded-md overflow-hidden">
                                                <ActionIcon
                                                    size="lg"
                                                    variant="subtle"
                                                    className="!border-none"
                                                    radius={0}
                                                    onClick={() =>
                                                        setQuantity((prev) =>
                                                            prev > 1
                                                                ? prev - 1
                                                                : 1
                                                        )
                                                    }
                                                >
                                                    -
                                                </ActionIcon>
                                                <TextBox
                                                    w={50}
                                                    h={30}
                                                    type="number"
                                                    value={quantity}
                                                    className="[&>.mantine-Input-wrapper>input]:!border-none"
                                                    min={1}
                                                    onChange={(e) =>
                                                        setQuantity(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    }
                                                />
                                                <ActionIcon
                                                    size="lg"
                                                    variant="subtle"
                                                    className="!border-none"
                                                    radius={0}
                                                    onClick={() =>
                                                        setQuantity(
                                                            (prev) => prev + 1
                                                        )
                                                    }
                                                >
                                                    +
                                                </ActionIcon>
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>

                            <Button
                                color="#9C82BF"
                                onClick={cartHandler}
                                loading={result.isLoading}
                                disabled={isCart}
                            >
                                {isCart ? "Added" : "Add"} to Cart
                            </Button>
                        </Grid.Col>
                    </Grid>

                    <Card withBorder>
                        <Text size="lg" fw={600}>
                            Description
                        </Text>
                        <TypographyStylesProvider my="xs">
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: product?.description,
                                }}
                            />
                        </TypographyStylesProvider>
                    </Card>
                </Box>
            )}
        </Container>
    );
};

Show.layout = (page) => <WebsiteLayout children={page} />;
export default Show;
