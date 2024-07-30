import { Link } from "@inertiajs/react";
import {
    Anchor,
    Box,
    Card,
    Flex,
    Image,
    NumberFormatter,
    Overlay,
    Text,
} from "@mantine/core";
import React from "react";
import { imageUrlBuilder } from "../../../utils/Helpers";

const ProductItem = ({ data = {} }) => {
    return (
        <Card withBorder p="sm" radius="md" className="!font-primary">
            <Card.Section inheritPadding py="md">
                <Box pos="relative" h={180}>
                    <Image
                        src={imageUrlBuilder(data?.attachments)}
                        h="100%"
                        radius="md"
                    />
                    {data?.discount_properties &&
                    data?.discount_properties?.value > 0 ? (
                        <Overlay
                            color="#F3F8FE"
                            backgroundOpacity={0.01}
                            radius="md"
                            zIndex={11}
                        >
                            <Text
                                bg="#9C82BF"
                                className="!inline-block shadow rounded-sm"
                                size="sm"
                                c="white"
                                px="sm"
                                fw={600}
                            >
                                {`-${data?.discount_properties?.value}${
                                    data?.discount_properties?.type ===
                                    "percentage"
                                        ? "%"
                                        : ""
                                }`}
                            </Text>
                        </Overlay>
                    ) : (
                        ""
                    )}
                </Box>
            </Card.Section>

            <Flex direction="column" align="center">
                <Box w="80%">
                    <Anchor
                        component={Link}
                        href={`${window.origin}/products/${data?.slug}`}
                        c="#9C82BF"
                    >
                        <Text
                            size="xs"
                            fw={500}
                            truncate="end"
                            title={data?.name}
                            c="#9C82BF"
                        >
                            {data?.name}
                        </Text>
                    </Anchor>
                </Box>
                <Flex align="center" gap="xs">
                    <Text
                        size={data?.discount_price > 0 ? "xs" : "md"}
                        fw={600}
                        c={data?.discount_price > 0 ? "dimmed" : "#9C82BF"}
                        td={data?.discount_price > 0 ? "line-through" : ""}
                    >
                        <NumberFormatter
                            prefix="$"
                            value={data?.regular_price}
                            thousandSeparator
                        />
                    </Text>

                    {data?.discount_price > 0 ? (
                        <Text size="md" fw={600} c="#9C82BF">
                            <NumberFormatter
                                prefix="$"
                                value={data?.discount_price}
                                thousandSeparator
                            />
                        </Text>
                    ) : (
                        ""
                    )}
                </Flex>
            </Flex>
        </Card>
    );
};

export default ProductItem;
