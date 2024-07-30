import { Icon } from "@iconify/react/dist/iconify.js";
import { router } from "@inertiajs/react";
import { ActionIcon } from "@mantine/core";
import React, { useState } from "react";
import TextBox from "../../../ui/TextBox";

const SearchBox = () => {
    const [input, setInput] = useState("");

    const submitHandler = (e) => {
        e.preventDefault();
        router.visit(`/products?search=${input}`);
    };

    return (
        <form onSubmit={submitHandler}>
            <TextBox
                radius="xl"
                placeholder="I'm shopping for..."
                rightSection={
                    <ActionIcon
                        radius="xl"
                        variant="subtle"
                        color="#9C82BF"
                        type="submit"
                    >
                        <Icon icon="f7:search" />
                    </ActionIcon>
                }
                onChange={(e) => setInput(e.target.value)}
            />
        </form>
    );
};

export default SearchBox;
