import { Button, Group, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import ProductCategoryForm from "../../components/backend/ProductCategoryForm";
import AppDialog from "../../components/ui/AppDialog";
import AppPagination from "../../components/ui/AppPagination";
import AppSearchBox from "../../components/ui/AppSearchBox";
import { AppSkeleton } from "../../components/ui/AppSkeleton";
import AppTable from "../../components/ui/AppTable";
import OptionButton from "../../components/ui/OptionButton";
import BackendLayout from "../../layouts/BackendLayout";
import {
    useDeleteEmployeeMutation,
    useFetchEmployeeQuery,
    useFetchEmployeesQuery,
} from "../../store/api/slices/employeeSlice";
import {
    deleteHandler,
    dialogCloseHandler,
    dialogOpenHandler,
    paramsChangeHandler,
    tableIndex,
} from "../../utils/Helpers";
import EmployeeForm from "../../components/backend/EmployeeForm";

const Employees = () => {
    const [deleteEmployee, resultDelete] = useDeleteEmployeeMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedId, setSelectedId] = useState(null);
    const [skip, setSkip] = useState(true);

    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Name", align: "left", minW: 200 },
        { field: "Email", align: "left", minW: 200 },
        { field: "Phone", align: "left", minW: 200 },
        { field: "Role", align: "left", minW: 200 },
        { field: "Options", align: "center", minW: 200 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data, refetch } = useFetchEmployeesQuery(
        `page=${params.page}&offset=${params.offset}&relations[]=role:id,name${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    const {
        isFetching: isEmployeeFetching,
        data: employee,
        isUninitialized,
    } = useFetchEmployeeQuery(selectedId, {
        skip,
        refetchOnMountOrArgChange: true,
    });

    return (
        <>
            <AppDialog
                open={opened}
                close={() => dialogCloseHandler(close, setSelectedId, setSkip)}
                title={`${
                    !isUninitialized && selectedId ? "Update" : "Add"
                } employee`}
            >
                {isEmployeeFetching ? (
                    <AppSkeleton />
                ) : (
                    <EmployeeForm
                        fetch={refetch}
                        payload={isUninitialized ? null : employee}
                        close={() =>
                            dialogCloseHandler(close, setSelectedId, setSkip)
                        }
                    />
                )}
            </AppDialog>
            <AppTable
                title="Employees"
                actions={
                    <Group>
                        <AppSearchBox
                            search={(value) =>
                                paramsChangeHandler("search", value, setParams)
                            }
                        />
                        <Button
                            onClick={() => dialogOpenHandler(open)}
                            color="#9C82BF"
                        >
                            Add new
                        </Button>
                    </Group>
                }
                isLoading={isFetching}
                found={data?.data?.length}
                headers={headers}
                rows={data?.data?.map((item, i) => (
                    <Table.Tr key={i}>
                        <Table.Td>{tableIndex(data?.from, i)}</Table.Td>
                        <Table.Td>{item?.name}</Table.Td>
                        <Table.Td>{item?.email}</Table.Td>
                        <Table.Td>{item?.phone}</Table.Td>
                        <Table.Td>{item?.role?.name}</Table.Td>
                        <Table.Td>
                            <Group justify="center" gap={8}>
                                <OptionButton
                                    edit
                                    onClick={() =>
                                        dialogOpenHandler(
                                            open,
                                            item?.id,
                                            setSelectedId,
                                            setSkip
                                        )
                                    }
                                    loading={resultDelete.isLoading}
                                />
                                <OptionButton
                                    remove
                                    onClick={() =>
                                        deleteHandler(
                                            item?.id,
                                            refetch,
                                            deleteEmployee
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
        </>
    );
};

Employees.layout = (page) => <BackendLayout children={page} />;
export default Employees;
