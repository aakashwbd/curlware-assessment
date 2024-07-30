import { Icon } from "@iconify/react";
import {
    ActionIcon,
    Box,
    Button,
    Card,
    Flex,
    Grid,
    Group,
    Image,
    Modal,
    Paper,
    ScrollArea,
    Select,
    Tabs,
    Text,
    TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import "filepond/dist/filepond.min.css";
import React, { useEffect, useState } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useSelector } from "react-redux";
import { images } from "../../constants/images";
import { useFetchMediaFilesQuery } from "../../store/api/slices/siteSlice";
import { alertMessage, imageUrlBuilder } from "../../utils/Helpers";

registerPlugin(
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType
);

const FileUploader = ({
    attachments = [],
    selectHandler = (value) => {},
    maxFiles = 3,
    checkValidity = true,
    allowMultiple = true,
    allowReorder = true,
    server = "/api/v1/media-files",
    disabled = false,
    name = "file",
    acceptedFileTypes = ["image/*"],
    labelIdle = 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
    label = "Select File",
    icon = <Icon icon="icon-park:upload-one" width={20} color="#9C82BF" />,
    multiple = false,
    type = "image",
    ...props
}) => {
    const { token } = useSelector((state) => state.auth);
    const [opened, { open, close }] = useDisclosure(false);

    // Tabs State
    const [activeTab, setActiveTab] = useState("galleries");
    const tabChanger = (value) => {
        setActiveTab(value);
        if (value === "galleries") {
            refetch();
        }
    };

    // File Manager State
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [params, setParams] = useState({
        page: 1,
        offset: 20,
        search: "",
        type: type,
    });
    const paramChangeHandler = (field, value) => {
        setParams((prevState) => ({ ...prevState, [field]: value }));
    };

    const { data, isFetching, isSuccess, isError, error, refetch } =
        useFetchMediaFilesQuery(
            `page=${params.page}&offset=${params.offset}&search=${
                params.search
            }${params.type ? `&type=${params.type}` : ""}`,
            { skip: !opened, refetchOnMountOrArgChange: true }
        );

    const thumbnailRender = (link, type) => {
        if (type === "image") {
            return `${window.origin}/${link}`;
        } else {
            return images.DefaultFileImage;
        }
    };
    const selectFileThumbnailRender = (value) => {
        let fileNameArr = value.split(".");
        let extension = fileNameArr[fileNameArr.length - 1];
        let Images = [
            "jpg",
            "png",
            "bmp",
            "jpeg",
            "webp",
            "gif",
            "JPG",
            "avif",
        ];
        if (Images.includes(extension)) {
            return value;
        }
        return images.DefaultFileImage;
    };

    const fileSelectedItem = (path) => {
        return selectedFiles.some((item) => item === path);
    };
    const fileSelectHandler = (value) => {
        let prevSelected = [...selectedFiles];
        if (multiple) {
            let findIndex = prevSelected.findIndex((item) => item === value);
            if (findIndex > -1) {
                prevSelected.splice(findIndex, 1);
            } else {
                prevSelected.push(value);
            }
        } else {
            if (!prevSelected.includes(value)) {
                prevSelected = [value];
            } else {
                prevSelected = [];
            }
        }
        setSelectedFiles(prevSelected);
    };
    const clearSelectedHandler = () => {
        setSelectedFiles([]);
    };
    const resetHandler = () => {
        setParams({ page: 1, offset: 20, search: "", type: "image" });
        clearSelectedHandler();
    };
    const submitHandler = () => {
        selectHandler(selectedFiles);
        resetHandler();
        close();
    };

    // File Uploader State
    const [files, setFiles] = useState([]);

    useEffect(() => {
        setSelectedFiles(attachments);
    }, [attachments]);

    return (
        <Box>
            <Button
                title={label}
                fullWidth
                variant="light"
                leftSection={icon}
                onClick={open}
                className="flex"
                color="#9C82BF"
            >
                {label}
            </Button>

            {attachments?.length > 0 && (
                <PhotoProvider>
                    <Flex wrap="wrap" gap="sm" my="md">
                        {attachments.map((item, i) => (
                            <PhotoView
                                src={selectFileThumbnailRender(
                                    imageUrlBuilder(item, images.DefaultImage)
                                )}
                                key={i}
                            >
                                <Box className="relative" key={i}>
                                    <Image
                                        src={selectFileThumbnailRender(
                                            imageUrlBuilder(
                                                item,
                                                images.DefaultImage
                                            )
                                        )}
                                        h={100}
                                        w={100}
                                        fit="contain"
                                        radius="sm"
                                        className="border"
                                    />
                                    <ActionIcon
                                        className="!absolute -top-2 -right-2 z-10"
                                        radius="lg"
                                        color="red"
                                        size="sm"
                                        onClick={() => {
                                            let prevState = [
                                                ...attachments.filter(
                                                    (fItem) => fItem !== item
                                                ),
                                            ];
                                            selectHandler(prevState);
                                        }}
                                    >
                                        <Icon icon="mdi:trash" />
                                    </ActionIcon>
                                </Box>
                            </PhotoView>
                        ))}
                    </Flex>
                </PhotoProvider>
            )}

            <Modal
                opened={opened}
                size="100%"
                centered
                title="File Manager"
                onClose={close}
            >
                <Tabs value={activeTab} onChange={(value) => tabChanger(value)}>
                    <Grid justify="space-between" mb="lg">
                        <Grid.Col span={{ base: 12, lg: 4 }}>
                            <Tabs.List grow>
                                <Tabs.Tab value="galleries">
                                    Select File's
                                </Tabs.Tab>
                                <Tabs.Tab value="uploads">
                                    Upload File's
                                </Tabs.Tab>
                            </Tabs.List>
                        </Grid.Col>
                        <Grid.Col span={{ base: 12, lg: 5 }}>
                            <Group justify="flex-end" gap="xs">
                                <Select
                                    disabled={activeTab !== "galleries"}
                                    placeholder="Select Type"
                                    data={[
                                        { label: "Image", value: "image" },
                                        { label: "Video", value: "video" },
                                        { label: "File", value: "file" },
                                    ]}
                                    value={params.type}
                                    onChange={(value) => {
                                        paramChangeHandler("type", value);
                                        paramChangeHandler("page", 1);
                                    }}
                                    maw={{ base: 180, lg: 200 }}
                                />
                                <TextInput
                                    disabled={activeTab !== "galleries"}
                                    placeholder="Search"
                                    value={params.search}
                                    onChange={(e) => {
                                        paramChangeHandler(
                                            "search",
                                            e.target.value
                                        );
                                        paramChangeHandler("page", 1);
                                    }}
                                    maw={{ base: 180, lg: 200 }}
                                />
                            </Group>
                        </Grid.Col>
                    </Grid>

                    <Tabs.Panel value="galleries">
                        <ScrollArea
                            offsetScrollbars
                            h={{ base: 400, lg: 500 }}
                            scrollbars="y"
                        >
                            {isFetching || isError ? (
                                <Text>Loading</Text>
                            ) : (
                                isSuccess && (
                                    <Grid>
                                        {data?.data?.map((item, i) => (
                                            <Grid.Col
                                                span={{ base: 6, lg: 2 }}
                                                key={i}
                                            >
                                                <Card
                                                    withBorder
                                                    radius="md"
                                                    shadow="md"
                                                    p="xs"
                                                    onClick={() =>
                                                        fileSelectHandler(
                                                            item?.path
                                                        )
                                                    }
                                                    className={`cursor-pointer select-none ${
                                                        fileSelectedItem(
                                                            item?.path
                                                        )
                                                            ? "!border-black"
                                                            : ""
                                                    }`}
                                                >
                                                    <Card.Section>
                                                        <Image
                                                            src={thumbnailRender(
                                                                item?.path,
                                                                item?.type
                                                            )}
                                                            h={160}
                                                            fit="contain"
                                                        />
                                                    </Card.Section>
                                                    <Text
                                                        size="sm"
                                                        lineClamp={1}
                                                    >
                                                        {item?.name}
                                                    </Text>
                                                    <Text size="xs">
                                                        {item?.extension}
                                                    </Text>
                                                    <Text size="xs">
                                                        {item?.size} kb
                                                    </Text>
                                                </Card>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                )
                            )}
                        </ScrollArea>

                        <Paper withBorder p="xs">
                            <Flex
                                gap="sm"
                                justify="space-between"
                                align="center"
                            >
                                <Group gap="xs">
                                    <Box>
                                        <Text size="sm">
                                            {selectedFiles?.length} File
                                            selected
                                        </Text>
                                        <Button
                                            title="Clear"
                                            size="xs"
                                            variant="light"
                                            color="red"
                                            onClick={clearSelectedHandler}
                                        >
                                            Clear
                                        </Button>
                                    </Box>
                                    <Button
                                        title="Prev"
                                        size="sm"
                                        disabled={
                                            Number(data?.from) ===
                                            Number(params.page)
                                        }
                                        onClick={() =>
                                            paramChangeHandler(
                                                "page",
                                                Number(params.page) - 1
                                            )
                                        }
                                        loading={isFetching}
                                    >
                                        Prev
                                    </Button>
                                    <Button
                                        title="Next"
                                        size="sm"
                                        disabled={
                                            Number(data?.last_page) ===
                                            Number(params.page)
                                        }
                                        onClick={() =>
                                            paramChangeHandler(
                                                "page",
                                                Number(params.page) + 1
                                            )
                                        }
                                        loading={isFetching}
                                    >
                                        Next
                                    </Button>
                                </Group>

                                <Button
                                    title="Add Files"
                                    size="sm"
                                    loading={isFetching}
                                    onClick={submitHandler}
                                    color="#9C82BF"
                                >
                                    Add Files
                                </Button>
                            </Flex>
                        </Paper>
                    </Tabs.Panel>

                    <Tabs.Panel value="uploads">
                        <FilePond
                            className="min-h-[200px] [&>.filepond--drop-label]:!min-h-[12em] [&>.filepond--credits]:hidden"
                            disabled={disabled}
                            files={files}
                            onupdatefiles={setFiles}
                            onprocessfile={(err, file) => {
                                let res = JSON.parse(file.serverId);
                                if (res.status === "success") {
                                    alertMessage({
                                        title: res.message,
                                        icon: "success",
                                        timer: 1500,
                                    });
                                    setFiles([]);
                                }
                            }}
                            acceptedFileTypes={acceptedFileTypes}
                            checkValidity={checkValidity}
                            allowMultiple={allowMultiple}
                            allowReorder={allowReorder}
                            maxFiles={maxFiles}
                            name={name}
                            labelIdle={labelIdle}
                            server={{
                                url: server,
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                },
                            }}
                            {...props}
                        />
                    </Tabs.Panel>
                </Tabs>
            </Modal>
        </Box>
    );
};

export default FileUploader;
