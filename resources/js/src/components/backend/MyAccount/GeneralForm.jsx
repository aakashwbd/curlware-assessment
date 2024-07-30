import { Button } from "@mantine/core";
import Validator from "Validator";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuthUpdateMutation } from "../../../store/api/slices/authSlice";
import { setCurrentUser } from "../../../store/reducers/authReducer";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";
import FileUploader from "../../ui/FileUploader";
import TextBox from "../../ui/TextBox";

const GeneralForm = () => {
    const dispatch = useDispatch();
    const { currentUser } = useSelector((state) => state.auth);
    const [authUpdate, result] = useAuthUpdateMutation();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        avatars: [],
    });

    const [errors, setErrors] = useState({
        name: { text: "", show: false },
        email: { text: "", show: false },
        phone: { text: "", show: false },
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

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            Cookies.set("authToken", data.data.token, { expires: 1 });
            Cookies.set("user", JSON.stringify(data.data.user), { expires: 1 });
            dispatch(setCurrentUser(data?.data?.user));
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
            email: "required|email:filter",
            phone: "sometimes",
            avatars: "sometimes|array",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await authUpdate(form);
            callbackHandler(data, error);
        }
    };

    useEffect(() => {
        if (currentUser && Object.keys(currentUser).length) {
            let obj = { ...form };
            Object.keys(currentUser).forEach((key) => {
                if (currentUser[key] !== null) {
                    obj[key] = currentUser[key];
                }
            });
            setForm(obj);
        }
    }, [currentUser]);

    return (
        <form className="flex flex-col gap-2" onSubmit={submitHandler}>
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
                disabled
            />
            <TextBox
                label="Phone"
                value={form.phone}
                onChange={(e) => fieldChangeHandler("phone", e.target.value)}
                error={errors.phone.text}
            />

            <FileUploader
                attachments={form.avatars}
                selectHandler={(value) => fieldChangeHandler("avatars", value)}
                acceptedFileTypes={["image/*"]}
            />
            <div className="flex gap-2 justify-end mt-2">
                <Button
                    type="submit"
                    loading={result.isLoading}
                    color="#9C82BF"
                >
                    Update
                </Button>
            </div>
        </form>
    );
};

export default GeneralForm;
