import { Button } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Validator from "Validator";
import {
    useCreateRoleMutation,
    useUpdateRoleMutation,
} from "../../store/api/slices/roleSlice";
import { alertMessage, validateErrorGenerator } from "../../utils/Helpers";
import TextBox from "../ui/TextBox";

const RoleForm = ({
    payload = () => {},
    close = () => {},
    fetch = () => {},
}) => {
    const [create, resultCreate] = useCreateRoleMutation();
    const [update, resultUpdate] = useUpdateRoleMutation();

    const [form, setForm] = useState({
        name: "",
    });

    const [errors, setErrors] = useState({
        name: { text: "", show: false },
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
        });
        setForm({
            name: "",
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
            name: "required",
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

export default RoleForm;
