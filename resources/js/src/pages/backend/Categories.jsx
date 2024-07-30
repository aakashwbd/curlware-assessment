import { Button, Group, Image, Table } from "@mantine/core";
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
    useDeleteProductCategoryMutation,
    useFetchProductCategoriesQuery,
    useFetchProductCategoryQuery,
} from "../../store/api/slices/productCategorySlice";
import {
    deleteHandler,
    dialogCloseHandler,
    dialogOpenHandler,
    imageUrlBuilder,
    paramsChangeHandler,
    tableIndex,
} from "../../utils/Helpers";

const Categories = () => {
    const [deleteCategory, resultDelete] = useDeleteProductCategoryMutation();
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedId, setSelectedId] = useState(null);
    const [skip, setSkip] = useState(true);

    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Name", align: "left", minW: 200 },
        { field: "Parent", align: "left", minW: 200 },
        { field: "Options", align: "center", minW: 200 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data, refetch } = useFetchProductCategoriesQuery(
        `fields=id,parent_id,name,attachments&relations[]=parent:id,name&page=${
            params.page
        }&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    const {
        isFetching: isCategoryFetching,
        data: category,
        isUninitialized,
    } = useFetchProductCategoryQuery(selectedId, {
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
                } category`}
            >
                {isCategoryFetching ? (
                    <AppSkeleton />
                ) : (
                    <ProductCategoryForm
                        fetch={refetch}
                        payload={isUninitialized ? null : category}
                        close={() =>
                            dialogCloseHandler(close, setSelectedId, setSkip)
                        }
                    />
                )}
            </AppDialog>
            <AppTable
                title="Product Categories"
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
                        <Table.Td>
                            <Group>
                                <Image
                                    src={imageUrlBuilder(item?.attachments)}
                                    w={40}
                                    h={40}
                                />
                                {item?.name}
                            </Group>
                        </Table.Td>
                        <Table.Td>{item?.parent?.name}</Table.Td>
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
                                            deleteCategory
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

Categories.layout = (page) => <BackendLayout children={page} />;
export default Categories;
