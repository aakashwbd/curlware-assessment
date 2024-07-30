import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, router } from "@inertiajs/react";
import { Avatar, Box, Group, Menu, Text } from "@mantine/core";
import Cookies from "js-cookie";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCurrentUser } from "../../../../store/reducers/authReducer";
import { imageUrlBuilder } from "../../../../utils/Helpers";

const ProfileBox = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);

    const logoutHandler = () => {
        dispatch(clearCurrentUser());
        Cookies.remove("authToken");
        Cookies.remove("user");
        router.visit(`${window.origin}/admin/login`);
    };

    return (
        <Menu shadow="md" trigger="click-hover" position="bottom-end" withArrow>
            <Menu.Target>
                <Avatar
                    src={imageUrlBuilder(currentUser?.avatars)}
                    size={30}
                    radius="sm"
                />
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>
                    <Group>
                        <Avatar
                            src={imageUrlBuilder(currentUser?.avatars)}
                            radius="sm"
                        />
                        <Box className="text-end">
                            <Text size="sm" fw={600} c="#9C82BF">
                                {currentUser?.name || ""}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {currentUser?.email || ""}
                            </Text>
                        </Box>
                    </Group>
                </Menu.Label>
                <Menu.Divider />
                <Menu.Item
                    color="#9C82BF"
                    leftSection={<Icon icon="fa-regular:user" />}
                    component={Link}
                    href="/admin/my-account?tab=general_information"
                >
                    My Account
                </Menu.Item>
                <Menu.Item
                    color="#9C82BF"
                    leftSection={<Icon icon="carbon:password" />}
                    component={Link}
                    href="/admin/my-account?tab=password"
                >
                    Change Password
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                    color="red"
                    leftSection={<Icon icon="fe:logout" />}
                    onClick={logoutHandler}
                >
                    Log out
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};

export default ProfileBox;
