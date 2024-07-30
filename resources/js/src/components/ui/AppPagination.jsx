import { Group, Pagination, Text } from "@mantine/core";
import React from "react";

const AppPagination = ({
    page = 1,
    offset = 8,
    total = 0,
    length = 0,
    from = 0,
    to = 0,
    paginateChangeHandler = (value) => {},
}) => {
    return (
        <Group justify="space-between">
            <Text size="sm" c="gray">
                Showing {from} to {to} of {total} entities
            </Text>
            <Pagination
                size="sm"
                total={length}
                value={page}
                onChange={(value) => paginateChangeHandler(value)}
                radius="sm"
                withEdges
                color="#9C82BF"
            />
        </Group>
    );
};

export default AppPagination;
