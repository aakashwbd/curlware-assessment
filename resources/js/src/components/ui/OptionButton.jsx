import { Icon } from "@iconify/react/dist/iconify.js";
import { ActionIcon, Tooltip } from "@mantine/core";
import React from "react";

const OptionButton = ({
    tooltip = "",
    icon = "",
    edit = false,
    remove = false,
    view = false,
    ...props
}) => {
    if (edit) {
        return (
            <Tooltip label="Edit" withArrow>
                <ActionIcon variant="light" color="cyan" {...props}>
                    <Icon icon="tabler:edit" />
                </ActionIcon>
            </Tooltip>
        );
    }
    if (remove) {
        return (
            <Tooltip label="Delete" withArrow>
                <ActionIcon variant="light" color="red" {...props}>
                    <Icon icon="ph:trash-light" />
                </ActionIcon>
            </Tooltip>
        );
    }
    if (view) {
        return (
            <Tooltip label="View" withArrow>
                <ActionIcon variant="light" color="gray" {...props}>
                    <Icon icon="carbon:view" />
                </ActionIcon>
            </Tooltip>
        );
    }

    return (
        <Tooltip label={tooltip} withArrow>
            <ActionIcon {...props}>
                <Icon icon={icon} />
            </ActionIcon>
        </Tooltip>
    );
};

export default OptionButton;
