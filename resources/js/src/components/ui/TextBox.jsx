import { TextInput, Textarea } from "@mantine/core";
import React from "react";

const TextBox = ({ multiline = false, ...props }) => {
    if (multiline) {
        return <Textarea {...props} />;
    }
    return <TextInput {...props} />;
};

export default TextBox;
