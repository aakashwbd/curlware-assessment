import { PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React from "react";

const PasswordBox = ({ ...props }) => {
    const [visible, { toggle }] = useDisclosure(false);

    return (
        <PasswordInput
            visible={visible}
            onVisibilityChange={toggle}
            {...props}
        />
    );
};

export default PasswordBox;
