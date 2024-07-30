import { Link } from "@inertiajs/react";
import { Anchor, Box, Group, Text } from "@mantine/core";
import React from "react";

const PageHeader = ({ label = "", url = "" }) => {
    return (
        <Group justify="space-between" mb="sm">
            <Text
                size="xl"
                ff="heading"
                className="!font-secondary"
                c="#9C82BF"
            >
                {label}
            </Text>
            <Anchor
                component={Link}
                href={url}
                size="sm"
                c="#9C82BF"
                className="!font-secondary"
            >
                View all
            </Anchor>
        </Group>
    );
};

export default PageHeader;
