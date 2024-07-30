import { Icon } from "@iconify/react/dist/iconify.js";
import { Link } from "@inertiajs/react";
import { Box, NavLink } from "@mantine/core";
import React from "react";
import AppLogo from "../../../shared/AppLogo";
import { List } from "./List";

const SideBar = ({ toggle = () => {} }) => {
    return (
        <>
            <AppLogo w="100%" h={40} navigateTo="/admin/dashboard" />
            <Box mt="xs">
                {List?.map((item, i) =>
                    !item?.items?.length ? (
                        <NavLink
                            component={Link}
                            label={item?.label}
                            href={item?.path}
                            key={i}
                            leftSection={
                                <Icon icon={item?.icon} fontSize={20} />
                            }
                            onClick={toggle}
                            variant="filled"
                            c="white"
                            className="rounded hover:!bg-[#9C82BF]"
                        />
                    ) : (
                        <NavLink
                            label={item?.label}
                            childrenOffset={28}
                            key={i}
                            leftSection={
                                <Icon icon={item?.icon} fontSize={20} />
                            }
                            variant="filled"
                            c="white"
                            className="rounded hover:!bg-[#9C82BF]"
                        >
                            {item?.items?.map((nItem, nI) => (
                                <NavLink
                                    component={Link}
                                    key={nI}
                                    href={nItem?.path}
                                    label={nItem?.label}
                                    onClick={toggle}
                                    variant="filled"
                                    c="white"
                                    className="rounded hover:!bg-[#9C82BF]"
                                />
                            ))}
                        </NavLink>
                    )
                )}
            </Box>
        </>
    );
};

export default SideBar;
