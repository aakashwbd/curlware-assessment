import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionIcon, Tooltip } from "@mantine/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSkin } from "../../store/reducers/siteReducer";

const Skin = () => {
    const dispatch = useDispatch();
    const { skin } = useSelector((state) => state.site);

    const skinHandler = (skin) => {
        localStorage.setItem("skin", skin);
        dispatch(setSkin(skin));
    };

    return (
        <Tooltip
            label={`Switch to ${skin === "dark" ? "Light" : "Dark"}`}
            withArrow
        >
            <ActionIcon
                variant="default"
                radius="sm"
                onClick={() =>
                    skinHandler(
                        skin === "dark"
                            ? "light"
                            : skin === "light"
                            ? "dark"
                            : ""
                    )
                }
            >
                <Icon
                    icon={skin === "dark" ? "circum:dark" : "entypo:light-up"}
                />
            </ActionIcon>
        </Tooltip>
    );
};

export default Skin;
