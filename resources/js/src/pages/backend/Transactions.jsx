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
    useFetchTransactionsQuery,
} from "../../store/api/slices/orderSlice";
import {
    deleteHandler,
    getStatus,
    paramsChangeHandler,
    tableIndex,
} from "../../utils/Helpers";

const Transactions = () => {
    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Transaction No.", align: "left", minW: 200 },
        { field: "Order No.", align: "left", minW: 200 },
        { field: "Payment Method", align: "left", minW: 200 },
        { field: "Amount", align: "left", minW: 200 },
        { field: "Status", align: "left", minW: 200 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data } = useFetchTransactionsQuery(
        `page=${params.page}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    return (
        <AppTable
            title="Transactions"
            isLoading={isFetching}
            found={data?.data?.length}
            headers={headers}
            rows={data?.data?.map((item, i) => (
                <Table.Tr key={i}>
                    <Table.Td>{tableIndex(data?.from, i)}</Table.Td>
                    <Table.Td>{item?.transaction_id}</Table.Td>
                    <Table.Td>{item?.plan_data?.id}</Table.Td>
                    <Table.Td>
                        <Badge radius="sm" variant="outline" color="#9C82BF">
                            {item?.gateway}
                        </Badge>
                    </Table.Td>
                    <Table.Td>
                        <NumberFormatter
                            prefix="$"
                            value={item?.amount}
                            thousandSeparator
                        />
                    </Table.Td>
                    <Table.Td>
                        <Badge radius="sm" color={getStatus(item?.status)}>
                            {item?.status}
                        </Badge>
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

Transactions.layout = (page) => <BackendLayout children={page} />;
export default Transactions;
