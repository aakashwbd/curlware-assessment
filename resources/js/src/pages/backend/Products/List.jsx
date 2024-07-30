import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, router } from "@inertiajs/react";
import {
    ActionIcon,
    Button,
    Group,
    Image,
    NumberFormatter,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useState } from "react";
import ImportProductForm from "../../../components/backend/ImportProductForm";
import AppDialog from "../../../components/ui/AppDialog";
import AppPagination from "../../../components/ui/AppPagination";
import AppSearchBox from "../../../components/ui/AppSearchBox";
import AppTable from "../../../components/ui/AppTable";
import OptionButton from "../../../components/ui/OptionButton";
import BackendLayout from "../../../layouts/BackendLayout";
import {
    useDeleteProductMutation,
    useFetchProductsQuery,
} from "../../../store/api/slices/productSlice";
import {
    deleteHandler,
    imageUrlBuilder,
    paramsChangeHandler,
    tableIndex,
} from "../../../utils/Helpers";

const List = () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [deleteProduct, resultDelete] = useDeleteProductMutation();
    const [headers] = useState([
        { field: "SL.", align: "left", minW: 60 },
        { field: "Name", align: "left", minW: 200 },
        { field: "Price", align: "left", minW: 200 },
        { field: "Category", align: "left", minW: 200 },
        { field: "Options", align: "center", minW: 200 },
    ]);

    const [params, setParams] = useState({
        page: 1,
        offset: 12,
        search: null,
    });

    const { isFetching, data, refetch } = useFetchProductsQuery(
        `fields=id,name,category_id,regular_price,attachments&relations[]=category:id,name&page=${
            params.page
        }&offset=${params.offset}${
            params.search ? `&search=${params.search}` : ""
        }`
    );

    return (
        <>
            <AppDialog title="Import Products" open={opened} close={close}>
                <ImportProductForm close={close} fetch={refetch} />
            </AppDialog>
            <AppTable
                title="Products"
                actions={
                    <Group>
                        <Tooltip label="Import CSV" withArrow>
                            <ActionIcon
                                variant="default"
                                radius="xl"
                                onClick={open}
                            >
                                <Icon icon="iconoir:import" />
                            </ActionIcon>
                        </Tooltip>
                        <AppSearchBox
                            search={(value) =>
                                paramsChangeHandler("search", value, setParams)
                            }
                        />
                        <Button
                            onClick={() =>
                                router.visit("/admin/products/create")
                            }
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
                                    w={40}
                                    h={40}
                                    src={imageUrlBuilder(item?.attachments)}
                                />
                                <Text
                                    size="sm"
                                    truncate="end"
                                    title={item?.name}
                                    w={400}
                                >
                                    {item?.name}
                                </Text>
                            </Group>
                        </Table.Td>
                        <Table.Td>
                            <NumberFormatter
                                value={item?.regular_price}
                                thousandSeparator
                                prefix="$"
                            />
                        </Table.Td>
                        <Table.Td>{item?.category?.name}</Table.Td>
                        <Table.Td>
                            <Group justify="center" gap={8}>
                                <OptionButton
                                    edit
                                    component={Link}
                                    href={`/admin/products/${item?.id}/edit`}
                                    loading={resultDelete.isLoading}
                                />
                                <OptionButton
                                    remove
                                    onClick={() =>
                                        deleteHandler(
                                            item?.id,
                                            refetch,
                                            deleteProduct
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
List.layout = (page) => <BackendLayout children={page} />;
export default List;
