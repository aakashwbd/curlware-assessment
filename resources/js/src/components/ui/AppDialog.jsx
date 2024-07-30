import { Modal, ScrollArea } from "@mantine/core";
import React from "react";

const AppDialog = ({
    open = false,
    close = () => {},
    title = "",
    size = "lg",
    children,
    ...props
}) => {
    return (
        <Modal
            opened={open}
            onClose={close}
            title={title}
            scrollAreaComponent={ScrollArea.Autosize}
            size={size}
            overlayProps={{
                backgroundOpacity: 0.35,
                blur: 3,
            }}
            closeOnClickOutside={false}
            transitionProps={{ transition: "rotate-left" }}
            {...props}
        >
            {children}
        </Modal>
    );
};

export default AppDialog;
