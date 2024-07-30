import { Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Validator from "Validator";
import {
    useCreateEmployeeMutation,
    useUpdateEmployeeMutation,
} from "../../store/api/slices/employeeSlice";
import {
    alertMessage,
    mappedSelectData,
    validateErrorGenerator,
} from "../../utils/Helpers";
import FileUploader from "../ui/FileUploader";
import TextBox from "../ui/TextBox";
import SelectBox from "../ui/SelectBox";
import { useFetchRolesQuery } from "../../store/api/slices/roleSlice";

const EmployeeForm = ({
    payload = () => {},
    close = () => {},
    fetch = () => {},
}) => {
    const [create, resultCreate] = useCreateEmployeeMutation();
    const [update, resultUpdate] = useUpdateEmployeeMutation();

    const { data: roles } = useFetchRolesQuery("get_all=1&fields=id,name");

    const [form, setForm] = useState({
        type: "system_user",
        role_id: "",
        name: "",
        email: "",
        phone: "",
        password: "",
        avatars: [],
    });

    const [errors, setErrors] = useState({
        type: { text: "", show: false },
        role_id: { text: "", show: false },
        name: { text: "", show: false },
        email: { text: "", show: false },
        phone: { text: "", show: false },
        password: { text: "", show: false },
        avatars: { text: "", show: false },
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
            type: { text: "", show: false },
            role_id: { text: "", show: false },
            name: { text: "", show: false },
            email: { text: "", show: false },
            phone: { text: "", show: false },
            password: { text: "", show: false },
            avatars: { text: "", show: false },
        });
        setForm({
            type: "system_user",
            role_id: "",
            name: "",
            email: "",
            phone: "",
            password: "",
            avatars: [],
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
            type: "required|in:system_user",
            role_id: "required",
            name: "required",
            email: "required|email:filter",
            phone: "sometimes",
            password: "sometimes",
            avatars: "sometimes|array",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            if (Object.prototype.hasOwnProperty.call(form, "id")) {
                let formData = { ...form };

                formData = Object.keys(formData)
                    .filter((objKey) => objKey !== "password")
                    .reduce((newObj, key) => {
                        newObj[key] = formData[key];
                        return newObj;
                    }, {});

                let { data, error } = await update(formData);
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
            <SelectBox
                label="Role"
                data={mappedSelectData(roles, "name", "id")}
                value={form.role_id?.toString()}
                onChange={(value) => fieldChangeHandler("role_id", value)}
                error={errors.role_id.text}
            />
            <TextBox
                label="Name"
                value={form.name}
                onChange={(e) => fieldChangeHandler("name", e.target.value)}
                error={errors.name.text}
            />
            <TextBox
                label="Email"
                value={form.email}
                onChange={(e) => fieldChangeHandler("email", e.target.value)}
                error={errors.email.text}
            />
            <TextBox
                label="Phone"
                value={form.phone}
                onChange={(e) => fieldChangeHandler("phone", e.target.value)}
                error={errors.phone.text}
            />
            {!Object.prototype.hasOwnProperty.call(form, "id") && (
                <TextBox
                    label="Password"
                    value={form.password}
                    onChange={(e) =>
                        fieldChangeHandler("password", e.target.value)
                    }
                    error={errors.password.text}
                />
            )}

            <FileUploader
                attachments={form.avatars}
                selectHandler={(value) => fieldChangeHandler("avatars", value)}
                acceptedFileTypes={["image/*"]}
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
                    loading={resultCreate.isLoading || resultUpdate.isLoading}
                    color="#9C82BF"
                >
                    {Object.prototype.hasOwnProperty.call(form, "id")
                        ? "Update"
                        : "Save"}
                </Button>
            </div>
        </form>
    );
};

export default EmployeeForm;
