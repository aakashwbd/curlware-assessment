import { Link } from "@inertiajs/react";
import { Anchor, Avatar, Box, Divider, Group, Menu, Text } from "@mantine/core";
import Cookies from "js-cookie";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../../../../store/reducers/authReducer";
import { imageUrlBuilder } from "../../../../utils/Helpers";
import { setCartItems } from "../../../../store/reducers/siteReducer";

const AuthBox = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(clearCurrentUser());
        dispatch(setCartItems());
        Cookies.remove("authToken");
        Cookies.remove("user");
    };

    return (
        <Box>
            {!currentUser ? (
                <Group>
                    <Anchor
                        component={Link}
                        href="/login"
                        size="sm"
                        c="#9C82BF"
                    >
                        Login
                    </Anchor>
                    <Divider orientation="vertical" />
                    <Anchor
                        component={Link}
                        href="/register"
                        size="sm"
                        c="#9C82BF"
                    >
                        Registration
                    </Anchor>
                </Group>
            ) : (
                <Menu
                    shadow="md"
                    withArrow
                    position="bottom-end"
                    trigger="hover"
                >
                    <Menu.Target>
                        <Group>
                            <Avatar
                                size="sm"
                                src={imageUrlBuilder(currentUser?.avatars)}
                            />
                            <Text
                                size="xs"
                                fw={600}
                                visibleFrom="lg"
                                c="#9C82BF"
                            >
                                {currentUser?.name}
                            </Text>
                        </Group>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={logoutHandler}>Sign Out</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            )}
        </Box>
    );
};

export default AuthBox;
