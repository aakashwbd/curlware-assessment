import { MultiSelect, Select } from "@mantine/core";
import React from "react";

const SelectBox = ({ multiple = false, ...props }) => {
    if (multiple) {
        return (
            <MultiSelect
                searchable
                clearable
                comboboxProps={{
                    transitionProps: {
                        transition: "pop",
                        duration: 200,
                    },
                    shadow: "md",
                }}
                {...props}
            />
        );
    }
    return (
        <Select
            searchable
            clearable
            comboboxProps={{
                transitionProps: {
                    transition: "pop",
                    duration: 200,
                },
                shadow: "md",
            }}
            {...props}
        />
    );
};

export default SelectBox;
