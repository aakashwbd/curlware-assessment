import { Button, Text } from "@mantine/core";
import axios from "axios";
import React, { useState } from "react";
import Validator from "Validator";
import { alertMessage, validateErrorGenerator } from "../../utils/Helpers";
import Cookies from "js-cookie";

const ImportProductForm = ({ close = () => {}, fetch = () => {} }) => {
    const [form, setForm] = useState({
        file: "",
    });
    const [errors, setErrors] = useState({
        file: { text: "", show: false },
    });

    const fieldChangeHandler = (field, value) => {
        setErrors((prevErrors) => ({
            ...prevErrors,
            [field]: { text: "", show: false },
        }));
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };
    const resetHandler = () => {
        setErrors({
            file: { text: "", show: false },
        });
        setForm({
            file: "",
        });
        close();
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        let validation = Validator.make(form, {
            file: "required",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            const file = form.file;
            const formData = new FormData();
            formData.append("file", file);

            await axios
                .post(window.origin + "/api/v1/import-products", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Accept: "application/json",
                        Authorization: `Bearer ${Cookies.get("authToken")}`,
                    },
                })
                .then((res) => {
                    fetch();
                    resetHandler();
                    alertMessage({
                        title: res.data.message,
                        icon: "success",
                        timer: 1500,
                    });
                })
                .catch((err) => {
                    alertMessage({
                        title: err.response.data.message,
                        icon: "error",
                        timer: 2500,
                    });
                });
        }
    };

    return (
        <form onSubmit={submitHandler}>
            <div>
                <input
                    className="w-full border rounded p-1"
                    style={{
                        border: `1px solid ${
                            errors.file.show ? "#fa5252" : "#ced4da"
                        }  `,
                    }}
                    type="file"
                    accept=".csv"
                    onChange={(e) =>
                        fieldChangeHandler("file", e.target.files[0])
                    }
                />
                {errors.file.show && (
                    <span
                        className="text-xs"
                        style={{ color: errors.file.show ? "#fa5252" : "" }}
                    >
                        {errors.file.text}
                    </span>
                )}
                <Text size="sm" c="gray">
                    N.B: Import file type must be .csv file
                </Text>
            </div>

            <div className="flex gap-2 justify-end mt-2">
                <Button
                    type="button"
                    variant="outline"
                    color="pink"
                    onClick={resetHandler}
                >
                    Cancel
                </Button>
                <Button type="submit" color="#9C82BF">
                    Import
                </Button>
            </div>
        </form>
    );
};

export default ImportProductForm;
