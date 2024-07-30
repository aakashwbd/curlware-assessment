import { router, usePage } from "@inertiajs/react";
import { Button, Card, Checkbox, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Validator from "Validator";
import FileUploader from "../../../components/ui/FileUploader";
import NumberBox from "../../../components/ui/NumberBox";
import SelectBox from "../../../components/ui/SelectBox";
import TextBox from "../../../components/ui/TextBox";
import TextEditor from "../../../components/ui/TextEditor";
import { discountTypeOptions } from "../../../constants/selectOptions";
import BackendLayout from "../../../layouts/BackendLayout";
import { useFetchProductCategoriesQuery } from "../../../store/api/slices/productCategorySlice";
import {
    useCreateProductMutation,
    useFetchProductQuery,
    useUpdateProductMutation,
} from "../../../store/api/slices/productSlice";
import {
    alertMessage,
    mappedSelectData,
    validateErrorGenerator,
} from "../../../utils/Helpers";

const Form = () => {
    const { props } = usePage();
    const [create, resultCreate] = useCreateProductMutation();
    const [update, resultUpdate] = useUpdateProductMutation();

    const { data: categories } = useFetchProductCategoriesQuery(
        "get_all=1&fields=id,name"
    );

    const { isFetching, data: payload } = useFetchProductQuery(props.id, {
        skip: !props.id,
        refetchOnMountOrArgChange: true,
    });

    const [form, setForm] = useState({
        category_id: "",
        name: "",
        description: "",
        regular_price: "",
        discount_properties: {
            type: "flat",
            value: 0,
        },
        is_featured: false,
        attachments: [],
        status: "active",
    });

    const [errors, setErrors] = useState({
        category_id: { text: "", show: false },
        name: { text: "", show: false },
        description: { text: "", show: false },
        regular_price: { text: "", show: false },
        "discount_properties.type": { text: "", show: false },
        "discount_properties.value": { text: "", show: false },
        is_featured: { text: "", show: false },
        attachments: { text: "", show: false },
        status: { text: "", show: false },
    });

    const fieldChangeHandler = (field, value) => {
        setErrors((prevState) => ({
            ...prevState,
            [field]: { text: "", show: false },
        }));
        setForm((prevState) => ({
            ...prevState,
            [field]: value,
        }));
    };

    const subFieldChangeHandler = (field, subField, value) => {
        setErrors((prevState) => ({
            ...prevState,
            [`${field}.${subField}`]: { text: "", show: false },
        }));
        setForm((prevState) => ({
            ...prevState,
            [field]: {
                ...prevState[field],
                [subField]: value,
            },
        }));
    };

    const resetHandler = () => {
        setErrors({
            category_id: { text: "", show: false },
            name: { text: "", show: false },
            description: { text: "", show: false },
            regular_price: { text: "", show: false },
            "discount_properties.type": { text: "", show: false },
            "discount_properties.value": { text: "", show: false },
            is_featured: { text: "", show: false },
            attachments: { text: "", show: false },
            status: { text: "", show: false },
        });
        setForm({
            category_id: "",
            name: "",
            description: "",
            regular_price: "",
            discount_properties: {
                type: "flat",
                value: 0,
            },
            is_featured: false,
            attachments: [],
            status: "active",
        });
    };

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            router.visit("/admin/products");
            resetHandler();
            alertMessage({ title: data.message, icon: "success", timer: 1500 });
        } else if (error) {
            if (
                error.hasOwnProperty("status") &&
                error.status === "validate_error"
            ) {
                validateErrorGenerator(error.data, setErrors);
            } else {
                alertMessage({
                    title: error.message,
                    icon: "error",
                    timer: 2500,
                });
            }
        }
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        let payload = {};
        Object.keys(form).forEach((key) => {
            if (form[key] && typeof form[key] === "object") {
                Object.keys(form[key]).forEach((nKey) => {
                    payload[key + "." + nKey] = form[key][nKey];
                });
            } else {
                payload[key] = form[key];
            }
        });

        let validation = await Validator.make(payload, {
            category_id: "required",
            name: "required",
            description: "sometimes",
            regular_price: "sometimes",
            "discount_properties.type": "sometimes|in:percentage,flat",
            "discount_properties.value": "sometimes",
            is_featured: "sometimes|boolean",
            attachments: "sometimes|array",
            status: "sometimes|required|in:active,inactive",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            if (Object.prototype.hasOwnProperty.call(form, "id")) {
                let { data, error } = await update(form);
                callbackHandler(data, error);
            } else {
                let { data, error } = await create(form);
                callbackHandler(data, error);
            }
        }
    };

    useEffect(() => {
        if (payload && Object.keys(payload).length) {
            let obj = { ...form };
            Object.keys(payload).forEach((key) => {
                if (payload[key] !== null) {
                    obj[key] = payload[key];
                }
            });
            setForm(obj);
        }
    }, [payload]);

    return (
        <Card withBorder shadow="sm" w={{ base: "100%", lg: "50%" }}>
            <Card.Section inheritPadding py="sm" withBorder>
                <Text>
                    {Object.prototype.hasOwnProperty.call(form, "id")
                        ? "Update"
                        : "Add"}{" "}
                    Product
                </Text>
            </Card.Section>
            <Card.Section inheritPadding py="sm" withBorder>
                <form className="flex flex-col gap-4" onSubmit={submitHandler}>
                    <SelectBox
                        label="Category"
                        data={mappedSelectData(categories, "name", "id")}
                        value={form.category_id}
                        onChange={(value) =>
                            fieldChangeHandler("category_id", value)
                        }
                        error={errors.category_id.text}
                    />
                    <TextBox
                        label="Name"
                        value={form.name}
                        onChange={(e) =>
                            fieldChangeHandler("name", e.target.value)
                        }
                        error={errors.name.text}
                    />
                    <NumberBox
                        label="Price"
                        value={form.regular_price}
                        onChange={(value) =>
                            fieldChangeHandler("regular_price", value)
                        }
                        error={errors.regular_price.text}
                        allowNegative={false}
                        decimalScale={2}
                        thousandSeparator=","
                        prefix="$"
                    />
                    <NumberBox
                        label="Discount Amount"
                        value={form.discount_properties.value}
                        onChange={(value) =>
                            subFieldChangeHandler(
                                "discount_properties",
                                "value",
                                value
                            )
                        }
                        error={errors["discount_properties.value"]["text"]}
                        allowNegative={false}
                        decimalScale={2}
                        thousandSeparator=","
                        prefix="$"
                    />
                    <SelectBox
                        label="Discount Type"
                        data={discountTypeOptions}
                        value={form.discount_properties.type}
                        onChange={(value) =>
                            subFieldChangeHandler(
                                "discount_properties",
                                "type",
                                value
                            )
                        }
                        error={errors["discount_properties.type"]["text"]}
                    />
                    <TextEditor
                        label="Description"
                        value={form.description}
                        onChange={(e) =>
                            fieldChangeHandler("description", e.target.value)
                        }
                        error={errors.description.text}
                    />
                    <Checkbox
                        label="Is Featured?"
                        checked={form.is_featured}
                        onChange={(e) =>
                            fieldChangeHandler("is_featured", e.target.checked)
                        }
                        error={errors.is_featured.text}
                        color="#9C82BF"
                    />
                    <FileUploader
                        attachments={form.attachments}
                        selectHandler={(value) =>
                            fieldChangeHandler("attachments", value)
                        }
                        acceptedFileTypes={["image/*"]}
                    />
                    <div>
                        <Button
                            type="submit"
                            loading={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
                            color="#9C82BF"
                        >
                            {Object.prototype.hasOwnProperty.call(form, "id")
                                ? "Update"
                                : "Save"}
                        </Button>
                    </div>
                </form>
            </Card.Section>
        </Card>
    );
};
Form.layout = (page) => <BackendLayout children={page} />;
export default Form;
