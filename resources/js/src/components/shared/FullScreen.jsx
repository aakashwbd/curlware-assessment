import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionIcon, Tooltip } from "@mantine/core";
import { useFullscreen } from "@mantine/hooks";
import React from "react";

const FullScreen = () => {
    const { toggle, fullscreen } = useFullscreen();
    return (
        <Tooltip
            label={!fullscreen ? "Enter Fullscreen" : "Exit Fullscreen"}
            withArrow
        >
            <ActionIcon variant="default" radius="sm" onClick={toggle}>
                <Icon
                    icon={
                        !fullscreen
                            ? "ant-design:fullscreen-outlined"
                            : "ant-design:fullscreen-exit-outlined"
                    }
                />
            </ActionIcon>
        </Tooltip>
    );
};

export default FullScreen;
