import { Badge, Group, NumberFormatter, Table } from "@mantine/core";
import React, { useState } from "react";
import AppPagination from "../../components/ui/AppPagination";
import AppSearchBox from "../../components/ui/AppSearchBox";
import AppTable from "../../components/ui/AppTable";
import OptionButton from "../../components/ui/OptionButton";
import BackendLayout from "../../layouts/BackendLayout";
import {
    useDeleteOrderMutation,
    useFetchOrdersQuery,
} from "../../store/api/slices/orderSlice";
import {
    deleteHandler,
    getStatus,
    paramsChangeHandler,
    tableIndex,
} from "../../utils/Helpers";

const Orders = () => {
    const [deleteOrder, resultDelete] = useDeleteOrderMutation();
    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Order No.", align: "left", minW: 300 },
        { field: "Num. of Products", align: "left", minW: 80 },
        { field: "Customer", align: "left", minW: 200 },
        { field: "Amount", align: "left", minW: 100 },
        { field: "Delivery Status", align: "left", minW: 100 },
        { field: "Payment Method", align: "left", minW: 100 },
        { field: "Payment Status", align: "left", minW: 100 },
        { field: "Options", align: "center", minW: 80 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data, refetch } = useFetchOrdersQuery(
        `relations[]=user:id,name&page=${params.page}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    return (
        <AppTable
            title="Orders"
            actions={
                <Group>
                    <AppSearchBox
                        search={(value) =>
                            paramsChangeHandler("search", value, setParams)
                        }
                    />
                </Group>
            }
            isLoading={isFetching}
            found={data?.data?.length}
            headers={headers}
            rows={data?.data?.map((item, i) => (
                <Table.Tr key={i}>
                    <Table.Td>{tableIndex(data?.from, i)}</Table.Td>
                    <Table.Td>{item?.id}</Table.Td>
                    <Table.Td>{item?.cart_ids?.length}</Table.Td>
                    <Table.Td>{item?.user?.name}</Table.Td>
                    <Table.Td>
                        <NumberFormatter
                            prefix="$"
                            value={item?.amount}
                            thousandSeparator
                        />
                    </Table.Td>
                    <Table.Td>
                        <Badge
                            radius="sm"
                            color={getStatus(item?.delivery_status)}
                        >
                            {item?.delivery_status}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <Badge radius="sm" variant="outline" color="#9C82BF">
                            {item?.payment_method}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <Badge
                            radius="sm"
                            color={getStatus(item?.payment_status)}
                        >
                            {item?.payment_status}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <Group justify="center" gap={8}>
                            <OptionButton
                                remove
                                onClick={() =>
                                    deleteHandler(
                                        item?.id,
                                        refetch,
                                        deleteOrder
                                    )
                                }
                                loading={resultDelete.isLoading}
                            />
                        </Group>
                    </Table.Td>
                </Table.Tr>
            ))}
            pagination={
                <AppPagination
                    total={data?.total}
                    length={data?.last_page}
                    page={params?.page}
                    offset={params?.offset}
                    from={data?.from}
                    to={data?.to}
                    paginateChangeHandler={(value) =>
                        paramsChangeHandler("page", value, setParams)
                    }
                />
            }
        />
    );
};

Orders.layout = (page) => <BackendLayout children={page} />;
export default Orders;
