import { Icon } from "@iconify/react/dist/iconify.js";
import { Box, Card, Flex, Group, Skeleton, Text } from "@mantine/core";
import React from "react";

const SummaryBox = ({
    isLoading = false,
    label = "",
    value = "",
    icon = "",
}) => {
    if (isLoading) {
        return (
            <Card
                withBorder
                className="!shadow-[0px_6px_14px_rgba(35,39,52,0.04)]"
            >
                <Flex gap="xs" justify="space-between">
                    <Box>
                        <Skeleton h={20} w={100} mb="xs" />
                        <Skeleton h={20} w={200} />
                    </Box>
                    <Skeleton h={40} w={40} />
                </Flex>
            </Card>
        );
    }
    return (
        <Card withBorder className="!shadow-[0px_6px_14px_rgba(35,39,52,0.04)]">
            <Group justify="space-between">
                <Box>
                    <Text size="xl" className="!text-2xl">
                        {value}
                    </Text>
                    <Text size="sm" c="#9C82BF">
                        {label}
                    </Text>
                </Box>
                <Icon icon={icon} fontSize={32} color="gray" />
            </Group>
        </Card>
    );
};

export default SummaryBox;
