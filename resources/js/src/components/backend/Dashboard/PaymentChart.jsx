import { DonutChart } from "@mantine/charts";
import { Card, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";

const PaymentChart = ({ data = [] }) => {
    const [payload, setPayload] = useState([]);
    useEffect(() => {
        if (data && data.length) {
            let charts = [];
            data.forEach((item) => {
                charts.push({
                    name: item?.name,
                    value: Number(item?.amount),
                    color:
                        (item?.name === "paypal" && "#0079C1") ||
                        (item?.name === "stripe" && "#5433FF") ||
                        (item?.name === "cod" && "yellow"),
                });
            });
            setPayload(charts);
        }
    }, [data]);

    console.log("payload", payload);

    return (
        <Card withBorder>
            <Card.Section withBorder inheritPadding py="sm">
                <Text size="sm" c="#9C82BF">
                    Payment by Methods
                </Text>
            </Card.Section>
            {payload?.length ? (
                <DonutChart
                    tooltipDataSource="segment"
                    mt="sm"
                    mx="auto"
                    size={150}
                    thickness={20}
                    data={payload}
                />
            ) : (
                ""
            )}
        </Card>
    );
};

export default PaymentChart;
