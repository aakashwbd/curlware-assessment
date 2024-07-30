import {
    Anchor,
    Breadcrumbs,
    Card,
    Group,
    Image,
    Skeleton,
    Table,
    Text,
} from "@mantine/core";
import React from "react";
import { images } from "../../constants/images";

const AppTable = ({
    title = "",
    actions = "",
    filterOptions = "",
    headers = [],
    links = [],
    rows = "",
    found = false,
    isLoading = false,
    isTableContent = true,
    pagination,
    customContent = "",
}) => {
    return (
        <Card shadow="md" withBorder radius="md">
            {/* Title & Action bar (Search, add button etc) */}
            <Card.Section withBorder inheritPadding py="md">
                <Group justify="space-between">
                    {title && (
                        <Text fw={600} size="lg">
                            {title}
                        </Text>
                    )}
                    {actions}
                </Group>
            </Card.Section>

            {/* Filter option bar */}
            {filterOptions && (
                <Card.Section withBorder inheritPadding py="md">
                    {filterOptions}
                </Card.Section>
            )}

            {/* Content (Table or custom content) */}
            <Card.Section withBorder>
                {/* Data table */}
                {isTableContent && (
                    <Table.ScrollContainer minWidth={500}>
                        <Table
                            withColumnBorders
                            horizontalSpacing="md"
                            verticalSpacing="xs"
                            highlightOnHover={!isLoading}
                        >
                            <Table.Thead>
                                <Table.Tr>
                                    {headers?.map(
                                        ({ field, align, minW }, i) => (
                                            <Table.Td
                                                align={align}
                                                miw={minW}
                                                key={i}
                                                className="border-b"
                                            >
                                                {field}
                                            </Table.Td>
                                        )
                                    )}
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {isLoading ? (
                                    Array(10)
                                        .fill(1)
                                        .map((_, i) => (
                                            <Table.Tr key={i}>
                                                {Array(headers?.length)
                                                    .fill(1)
                                                    .map((_, sI) => (
                                                        <Table.Td key={sI}>
                                                            <Skeleton
                                                                height={30}
                                                            />
                                                        </Table.Td>
                                                    ))}
                                            </Table.Tr>
                                        ))
                                ) : found ? (
                                    rows
                                ) : (
                                    <Table.Tr>
                                        <Table.Td colSpan="100%">
                                            <Image
                                                src={images.NO_DATA}
                                                w={400}
                                                h={400}
                                                mx="auto"
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                )}
                {/* Custom content */}
                {customContent}
            </Card.Section>

            {/* data table pagination */}
            {pagination && (
                <Card.Section withBorder inheritPadding py="md">
                    {pagination}
                </Card.Section>
            )}
        </Card>
    );
};

export default AppTable;
