import React, { useState } from "react";
import { useChangePasswordMutation } from "../../../store/api/slices/authSlice";
import { useDispatch } from "react-redux";
import { router } from "@inertiajs/react";
import { clearCurrentUser } from "../../../store/reducers/authReducer";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";
import Validator from "Validator";
import { Button } from "@mantine/core";
import PasswordBox from "../../ui/PasswordBox";
import Cookies from "js-cookie";

const PasswordForm = () => {
    const dispatch = useDispatch();
    const [changePassword, result] = useChangePasswordMutation();

    const [form, setForm] = useState({
        current_password: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({
        current_password: { text: "", show: false },
        password: { text: "", show: false },
        password_confirmation: { text: "", show: false },
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

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            dispatch(clearCurrentUser());
            Cookies.remove("authToken");
            Cookies.remove("user");
            router.visit(`${window.origin}/admin/login`);

            alertMessage({ title: data.message, icon: "success", timer: 1500 });
        } else if (error) {
            console.log(error);
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
            current_password: "required",
            password: "required|min:6|confirmed",
            password_confirmation: "required|min:6",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await changePassword(form);
            callbackHandler(data, error);
        }
    };

    return (
        <form className="flex flex-col gap-2" onSubmit={submitHandler}>
            <PasswordBox
                label="Current Password"
                withAsterisk
                value={form.current_password}
                onChange={(e) =>
                    fieldChangeHandler("current_password", e.target.value)
                }
                error={errors.current_password.text}
                placeholder="Current Password"
            />
            <PasswordBox
                label="Password"
                withAsterisk
                value={form.password}
                onChange={(e) => fieldChangeHandler("password", e.target.value)}
                error={errors.password.text}
                placeholder="Password"
            />
            <PasswordBox
                label="Confirm Password"
                withAsterisk
                value={form.password_confirmation}
                onChange={(e) =>
                    fieldChangeHandler("password_confirmation", e.target.value)
                }
                error={errors.password_confirmation.text}
                placeholder="Confirm Password"
            />

            <div className="flex gap-2 justify-end mt-2">
                <Button
                    type="submit"
                    loading={result.isLoading}
                    color="#9C82BF"
                >
                    Change password
                </Button>
            </div>
        </form>
    );
};

export default PasswordForm;
