import { Icon } from "@iconify/react/dist/iconify.js";
import { Input } from "@mantine/core";
import React, { useEffect, useState } from "react";

const AppSearchBox = ({
    placeholder = "Search",
    search = (value) => {},
    size = "sm",
    ...props
}) => {
    const [input, setInput] = useState("");

    useEffect(() => {
        let timer;
        let value = input;
        timer = setTimeout(() => {
            search(value);
        }, 800);
        return () => clearTimeout(timer);
    }, [input]);

    return (
        <Input
            type="search"
            placeholder={placeholder}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            leftSection={<Icon icon="material-symbols-light:search" />}
            size={size}
            {...props}
        />
    );
};

export default AppSearchBox;
