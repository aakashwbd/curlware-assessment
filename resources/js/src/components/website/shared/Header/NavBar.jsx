import { Link } from "@inertiajs/react";
import {
    Box,
    Burger,
    Button,
    Container,
    Drawer,
    Flex,
    Group,
    NavLink,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import CartItem from "./CartItem";

const NavBar = () => {
    const [data] = useState([
        { label: "Home", path: "/" },
        { label: "All Categories", path: "/categories" },
        { label: "All Products", path: "/products" },
    ]);
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Drawer opened={opened} onClose={close} title="Menu">
                {data?.map((item, i) => (
                    <NavLink
                        component={Link}
                        href={item?.path}
                        label={item?.label}
                        key={i}
                        onClick={close}
                    />
                ))}
            </Drawer>
            <Box bg="#9C82BF">
                <Container size="xl" w="100%" py="xs">
                    <Group justify="space-between">
                        <Burger
                            opened={opened}
                            onClick={open}
                            hiddenFrom="sm"
                            size="sm"
                            color="white"
                        />
                        <Flex visibleFrom="lg">
                            {data?.map((item, i) => (
                                <Button
                                    color="#9C82BF"
                                    key={i}
                                    component={Link}
                                    href={item?.path}
                                >
                                    {item?.label}
                                </Button>
                            ))}
                        </Flex>
                        <CartItem />
                    </Group>
                </Container>
            </Box>
        </>
    );
};

export default NavBar;
