import React, { useEffect, useState } from "react";
import {
    useCreateProductCategoryMutation,
    useFetchProductCategoriesQuery,
    useUpdateProductCategoryMutation,
} from "../../store/api/slices/productCategorySlice";
import {
    alertMessage,
    mappedSelectData,
    validateErrorGenerator,
} from "../../utils/Helpers";
import Validator from "Validator";
import TextBox from "../ui/TextBox";
import SelectBox from "../ui/SelectBox";
import { Button, Checkbox } from "@mantine/core";
import FileUploader from "../ui/FileUploader";
const ProductCategoryForm = ({
    payload = () => {},
    close = () => {},
    fetch = () => {},
}) => {
    const [create, resultCreate] = useCreateProductCategoryMutation();
    const [update, resultUpdate] = useUpdateProductCategoryMutation();

    const { data: categories } = useFetchProductCategoriesQuery(
        "get_all=1&fields=id,name"
    );

    const [form, setForm] = useState({
        name: "",
        parent_id: "",
        is_featured: false,
        attachments: [],
        status: "active",
    });

    const [errors, setErrors] = useState({
        name: { text: "", show: false },
        parent_id: { text: "", show: false },
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

    const resetHandler = () => {
        setErrors({
            name: { text: "", show: false },
            parent_id: { text: "", show: false },
            is_featured: { text: "", show: false },
            attachments: { text: "", show: false },
            status: { text: "", show: false },
        });
        setForm({
            name: "",
            parent_id: "",
            is_featured: false,
            attachments: [],
            status: "active",
        });
        close();
    };

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            fetch();
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

        let validation = await Validator.make(form, {
            name: "sometimes|required",
            parent_id: "sometimes",
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
        <form className="flex flex-col gap-2" onSubmit={submitHandler}>
            <TextBox
                label="Name"
                value={form.name}
                onChange={(e) => fieldChangeHandler("name", e.target.value)}
                error={errors.name.text}
            />
            <SelectBox
                label="Parent category"
                data={mappedSelectData(categories, "name", "id")}
                value={form.parent_id}
                onChange={(value) => fieldChangeHandler("parent_id", value)}
                error={errors.parent_id.text}
            />
            <FileUploader
                attachments={form.attachments}
                selectHandler={(value) =>
                    fieldChangeHandler("attachments", value)
                }
                acceptedFileTypes={["image/*"]}
                label="Upload Category Image"
            />
            <Checkbox
                label="Is Featured"
                checked={form.is_featured}
                onChange={(e) =>
                    fieldChangeHandler("is_featured", e.target.checked)
                }
                error={errors.is_featured.text}
                color="#9C82BF"
            />
            <div className="flex gap-2 justify-end mt-2">
                <Button
                    type="button"
                    variant="outline"
                    color="pink"
                    onClick={resetHandler}
                >
                    Cancel
                </Button>
                <Button
                    type="submit"
                    color="#9C82BF"
                    loading={resultCreate.isLoading || resultUpdate.isLoading}
                >
                    {Object.prototype.hasOwnProperty.call(form, "id")
                        ? "Update"
                        : "Save"}
                </Button>
            </div>
        </form>
    );
};

export default ProductCategoryForm;
