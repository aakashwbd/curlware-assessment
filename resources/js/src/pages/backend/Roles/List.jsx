import { Link } from "@inertiajs/react";
import { Button, Group, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import RoleForm from "../../../components/backend/RoleForm";
import AppDialog from "../../../components/ui/AppDialog";
import AppPagination from "../../../components/ui/AppPagination";
import AppSearchBox from "../../../components/ui/AppSearchBox";
import { AppSkeleton } from "../../../components/ui/AppSkeleton";
import AppTable from "../../../components/ui/AppTable";
import OptionButton from "../../../components/ui/OptionButton";
import BackendLayout from "../../../layouts/BackendLayout";
import {
    useDeleteRoleMutation,
    useFetchRoleQuery,
    useFetchRolesQuery,
} from "../../../store/api/slices/roleSlice";
import {
    deleteHandler,
    dialogCloseHandler,
    dialogOpenHandler,
    paramsChangeHandler,
    tableIndex,
} from "../../../utils/Helpers";

const List = () => {
    const [deleteRole, resultDelete] = useDeleteRoleMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedId, setSelectedId] = useState(null);
    const [skip, setSkip] = useState(true);

    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Name", align: "left", minW: 200 },
        { field: "Options", align: "center", minW: 200 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data, refetch } = useFetchRolesQuery(
        `page=${params.page}&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    const {
        isFetching: isRoleFetching,
        data: role,
        isUninitialized,
    } = useFetchRoleQuery(selectedId, {
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
                } role`}
            >
                {isRoleFetching ? (
                    <AppSkeleton />
                ) : (
                    <RoleForm
                        fetch={refetch}
                        payload={isUninitialized ? null : role}
                        close={() =>
                            dialogCloseHandler(close, setSelectedId, setSkip)
                        }
                    />
                )}
            </AppDialog>
            <AppTable
                title="Roles"
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
                        <Table.Td>
                            <Group justify="center" gap={8}>
                                <OptionButton
                                    component={Link}
                                    tooltip="Permissions"
                                    icon="simple-line-icons:equalizer"
                                    variant="light"
                                    color="green"
                                    href={`${window.origin}/admin/roles/${item?.id}/permissions`}
                                    loading={resultDelete.isLoading}
                                    disabled={item?.id === 1}
                                />
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
                                    disabled={item?.id === 1}
                                />
                                <OptionButton
                                    remove
                                    onClick={() =>
                                        deleteHandler(
                                            item?.id,
                                            refetch,
                                            deleteRole
                                        )
                                    }
                                    loading={resultDelete.isLoading}
                                    disabled={item?.id === 1}
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

List.layout = (page) => <BackendLayout children={page} />;
export default List;
