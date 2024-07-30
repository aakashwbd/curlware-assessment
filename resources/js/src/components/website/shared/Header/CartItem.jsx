import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@inertiajs/react";
import {
    Box,
    Button,
    CloseButton,
    Divider,
    Flex,
    Group,
    HoverCard,
    Image,
    NumberFormatter,
    Table,
    Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    useDeleteCartMutation,
    useFetchCartsQuery,
} from "../../../../store/api/slices/cartSlice";
import { setCartItems } from "../../../../store/reducers/siteReducer";
import { deleteHandler, imageUrlBuilder } from "../../../../utils/Helpers";

const CartItem = () => {
    const [deleteCart, resultDelete] = useDeleteCartMutation();
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.site);

    const { data, refetch } = useFetchCartsQuery(
        `get_all=1&fields=id,product_id,quantity,amount&relations[]=product:id,name,regular_price,discount_price,attachments`,
        {
            skip: !currentUser,
            refetchOnMountOrArgChange: true,
        }
    );
    useEffect(() => {
        if (data && data.length) {
            dispatch(setCartItems(data));
        }
    }, [data]);

    const renderTotalAmount = (data) => {
        let totalAmount = 0;
        data?.forEach((item) => {
            totalAmount += Number(item?.amount);
        });
        return totalAmount;
    };

    return (
        <HoverCard
            width={400}
            withinPortal
            withArrow
            position="bottom-end"
            shadow="md"
        >
            <HoverCard.Target>
                <Button
                    color="#9C82BF"
                    leftSection={<Icon icon="f7:cart" fontSize={22} />}
                >
                    <Group>
                        <NumberFormatter
                            value={renderTotalAmount(cartItems) || 0}
                            prefix="$"
                            thousandSeparator
                        />
                        <Text>({cartItems?.length || 0} items)</Text>
                    </Group>
                </Button>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                {currentUser && cartItems?.length ? (
                    <Box>
                        <Text size="sm" c="#9C82BF" fw={600}>
                            Cart Items
                        </Text>
                        <Divider my="xs" />
                        {cartItems?.map((item, i) => (
                            <Table key={i}>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Td>
                                            <Image
                                                src={imageUrlBuilder(
                                                    item?.product?.attachments
                                                )}
                                                w={40}
                                                h={40}
                                            />
                                        </Table.Td>
                                        <Table.Td>
                                            <Text
                                                w={200}
                                                truncate
                                                size="sm"
                                                c="#9C82BF"
                                            >
                                                {item?.product?.name}
                                            </Text>
                                            <Text size="xs" c="dimmed">
                                                {item?.quantity} x{" "}
                                                <NumberFormatter
                                                    value={
                                                        item?.product
                                                            ?.discount_price > 0
                                                            ? item?.product
                                                                  ?.discount_price
                                                            : item?.product
                                                                  ?.regular_price
                                                    }
                                                    prefix="$"
                                                    thousandSeparator
                                                />
                                            </Text>
                                        </Table.Td>
                                        <Table.Td>
                                            <CloseButton
                                                size="xs"
                                                c="pink"
                                                onClick={() =>
                                                    deleteHandler(
                                                        item?.id,
                                                        refetch,
                                                        deleteCart
                                                    )
                                                }
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        ))}

                        <Button
                            color="#9C82BF"
                            variant="outline"
                            fullWidth
                            mt="xs"
                            component={Link}
                            href="/checkout"
                        >
                            View Cart
                        </Button>
                    </Box>
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
            </HoverCard.Dropdown>
        </HoverCard>
    );
};

export default CartItem;
