import { Icon } from "@iconify/react/dist/iconify.js";
import {
    Button,
    Card,
    Checkbox,
    Container,
    Flex,
    Grid,
    Image,
    NumberFormatter,
    Radio,
    Stack,
    Table,
    Text,
} from "@mantine/core";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { paymentMethods } from "../../constants/selectOptions";
import WebsiteLayout from "../../layouts/WebsiteLayout";
import { useFetchCartsQuery } from "../../store/api/slices/cartSlice";
import { useCreateOrderMutation } from "../../store/api/slices/orderSlice";
import { alertMessage, imageUrlBuilder } from "../../utils/Helpers";

const Checkout = () => {
    const { currentUser } = useSelector((state) => state.auth);

    const { data } = useFetchCartsQuery(
        `get_all=1&fields=id,product_id,quantity,amount&relations[]=product:id,name,regular_price,discount_price,attachments`,
        {
            skip: !currentUser,
            refetchOnMountOrArgChange: true,
        }
    );

    const [form, setForm] = useState({
        cart_ids: [],
        amount: "",
        payment_method: "",
        payment_status: "pending",
        delivery_status: "pending",
    });

    const renderSubTotal = (data) => {
        let totalAmount = 0;
        data?.forEach((item) => {
            totalAmount += Number(item?.amount);
        });
        return totalAmount;
    };

    const checkHandler = (data, checked) => {
        let carts = [...form.cart_ids];
        let amount = Number(form.amount);

        if (checked) {
            carts.push(data?.id);
            amount += Number(data?.amount);
        } else {
            carts = carts.filter((item) => item !== data?.id);
            amount -= Number(data?.amount);
        }

        setForm((prevState) => ({
            ...prevState,
            cart_ids: carts,
            amount: amount,
        }));
    };

    const [order, result] = useCreateOrderMutation();
    const submitHandler = async (e) => {
        e.preventDefault();

        let { data, error } = await order(form);
        if (data) {
            window.open(data?.data, "_self");
            alertMessage({ title: data.message, icon: "success", timer: 1500 });
        } else if (error) {
            alertMessage({
                title: error.message,
                icon: "error",
                timer: 2500,
            });
        }
    };

    return (
        <Container size="xl">
            <Grid>
                <Grid.Col span={{ base: 12, lg: 8 }}>
                    <Card withBorder>
                        <Card.Section withBorder inheritPadding py="sm">
                            <Text c="#9C82BF">Cart Items</Text>
                        </Card.Section>
                        <Card.Section withBorder inheritPadding py="sm">
                            {data?.length ? (
                                <Table withTableBorder>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Td></Table.Td>
                                            <Table.Td>Product</Table.Td>
                                            <Table.Td>Price</Table.Td>
                                            <Table.Td>Quantity</Table.Td>
                                            <Table.Td>Total</Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {data?.map((item, i) => (
                                            <Table.Tr key={i}>
                                                <Table.Td>
                                                    <Checkbox
                                                        checked={form?.cart_ids?.some(
                                                            (cItem) =>
                                                                cItem ===
                                                                item?.id
                                                        )}
                                                        onChange={(e) =>
                                                            checkHandler(
                                                                item,
                                                                e.target.checked
                                                            )
                                                        }
                                                        color="#9C82BF"
                                                    />
                                                </Table.Td>
                                                <Table.Td>
                                                    <Flex gap="xs">
                                                        <Image
                                                            src={imageUrlBuilder(
                                                                item?.product
                                                                    ?.attachments
                                                            )}
                                                            w={40}
                                                            h={40}
                                                            radius="sm"
                                                        />
                                                        <Text
                                                            size="xs"
                                                            fw={600}
                                                        >
                                                            {
                                                                item?.product
                                                                    ?.name
                                                            }
                                                        </Text>
                                                    </Flex>
                                                </Table.Td>
                                                <Table.Td align="right">
                                                    <NumberFormatter
                                                        prefix="$"
                                                        value={Number(
                                                            item?.amount
                                                        )}
                                                        thousandSeparator
                                                    />
                                                </Table.Td>
                                                <Table.Td align="right">
                                                    {item?.quantity}
                                                </Table.Td>
                                                <Table.Td align="right">
                                                    <NumberFormatter
                                                        prefix="$"
                                                        value={
                                                            Number(
                                                                item?.amount
                                                            ) *
                                                            Number(
                                                                item?.quantity
                                                            )
                                                        }
                                                        thousandSeparator
                                                    />
                                                </Table.Td>
                                            </Table.Tr>
                                        ))}
                                        <Table.Tr>
                                            <Table.Td colSpan={3} align="right">
                                                Total
                                            </Table.Td>
                                            <Table.Td colSpan={2} align="right">
                                                <NumberFormatter
                                                    prefix="$"
                                                    value={renderSubTotal(data)}
                                                    thousandSeparator
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Flex align="center" direction="column">
                                    <Icon
                                        icon="tabler:mood-empty"
                                        fontSize={56}
                                        color="gray"
                                    />
                                    <Text size="sm" mt="xs" c="dimmed">
                                        Your Cart is empty
                                    </Text>
                                </Flex>
                            )}
                        </Card.Section>
                    </Card>
                </Grid.Col>
                <Grid.Col span={{ base: 12, lg: 4 }}>
                    <Card withBorder>
                        <Card.Section withBorder inheritPadding py="sm">
                            <Text c="#9C82BF">Payment</Text>
                        </Card.Section>
                        <Card.Section withBorder inheritPadding py="sm">
                            <Stack>
                                {paymentMethods?.map((item, i) => (
                                    <Radio
                                        variant="outline"
                                        label={item?.label}
                                        key={i}
                                        value={item?.value}
                                        checked={
                                            item?.value === form.payment_method
                                        }
                                        color="#9C82BF"
                                        onChange={(e) =>
                                            setForm((prev) => ({
                                                ...prev,
                                                payment_method: e.target.value,
                                            }))
                                        }
                                        disabled={!data?.length}
                                    />
                                ))}
                            </Stack>
                            <Button
                                fullWidth
                                color="#9C82BF"
                                mt="lg"
                                onClick={submitHandler}
                                disabled={!form.payment_method}
                                loading={result.isLoading}
                            >
                                Complete Order ({form.cart_ids?.length || 0}{" "}
                                items)
                            </Button>
                        </Card.Section>
                    </Card>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

Checkout.layout = (page) => <WebsiteLayout children={page} />;
export default Checkout;
