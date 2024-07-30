import { TagsInput } from "@mantine/core";
import React from "react";

const TagBox = ({ ...props }) => {
    return <TagsInput clearable splitChars={[",", " ", "|"]} {...props} />;
};

export default TagBox;
