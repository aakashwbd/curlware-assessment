import { Group, Skeleton } from "@mantine/core";

export const AppSkeleton = () => {
    return (
        <div className="flex flex-col gap-3">
            {Array(6)
                .fill(1)
                .map((_, i) => (
                    <Skeleton h={35} key={i} />
                ))}

            <Group justify="end">
                <Skeleton h={35} w={100} />
                <Skeleton h={35} w={100} />
            </Group>
        </div>
    );
};
