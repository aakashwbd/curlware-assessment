import { Button, Card, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Validator from "Validator";
import {
    useCreatePaymentGatewayMutation,
    useFetchPaymentGatewaysQuery,
    useUpdatePaymentGatewayMutation,
} from "../../../store/api/slices/paymentGatewaySlice";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";
import FileUploader from "../../ui/FileUploader";
import TextBox from "../../ui/TextBox";

const Stripe = () => {
    const { isLoading, data } = useFetchPaymentGatewaysQuery(
        "type=online&gateway=stripe&get_all=1"
    );
    const [create, resultCreate] = useCreatePaymentGatewayMutation();
    const [update, resultUpdate] = useUpdatePaymentGatewayMutation();

    const [form, setForm] = useState({
        type: "online",
        gateway: "stripe",
        credentials: {
            secret_key: "",
        },
        additional: {
            image: "",
        },
        status: true,
    });

    const [errors, setErrors] = useState({
        type: { text: "", show: false },
        gateway: { text: "", show: false },
        "credentials.secret_key": { text: "", show: false },
        "additional.image": { text: "", show: false },
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

    const callbackHandler = (data = null, error = null) => {
        if (data) {
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
            if (typeof form[key] === "object") {
                Object.keys(form[key]).forEach((nKey) => {
                    payload[key + "." + nKey] = form[key][nKey];
                });
            } else {
                payload[key] = form[key];
            }
        });

        let validation = await Validator.make(
            payload,
            {
                type: "required|in:online,offline",
                gateway: "required",
                "credentials.secret_key": "required",
                "additional.image": "sometimes",
                status: "sometimes",
            },
            {},
            {
                "credentials.secret_key": "app secret key",
            }
        );

        if (validation.fails()) {
            const errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            if (form.hasOwnProperty("id")) {
                let { data, error } = await update(form);
                callbackHandler(data, error);
            } else {
                let { data, error } = await create(form);
                callbackHandler(data, error);
            }
        }
    };

    useEffect(() => {
        if (data && data?.length) {
            let payload = data[0];

            if (Object.keys(payload).length) {
                let obj = { ...form };
                Object.keys(payload).forEach((key) => {
                    if (typeof payload[key] === "object") {
                        Object.keys(payload[key]).forEach((nKey) => {
                            if (payload[key][nKey] !== null) {
                                obj[key][nKey] = payload[key][nKey];
                            }
                        });
                    } else {
                        if (payload !== null) {
                            obj[key] = payload[key];
                        }
                    }
                });
                setForm(obj);
            }
        }
    }, [data]);

    return (
        <Card withBorder shadow="sm">
            <Card.Section inheritPadding py="sm" withBorder>
                <Text>Paypal Configuration</Text>
            </Card.Section>
            <Card.Section inheritPadding py="sm" withBorder>
                <form className="flex flex-col gap-4" onSubmit={submitHandler}>
                    <TextBox
                        label="App Secret"
                        value={form.credentials.secret_key}
                        onChange={(e) =>
                            subFieldChangeHandler(
                                "credentials",
                                "secret_key",
                                e.target.value
                            )
                        }
                        error={errors["credentials.secret_key"]["text"]}
                    />

                    <FileUploader
                        attachments={form.additional.image}
                        selectHandler={(value) =>
                            subFieldChangeHandler("additional", "image", value)
                        }
                        acceptedFileTypes={["image/*"]}
                    />
                    <div>
                        <Button
                            type="submit"
                            color="#9C82BF"
                            loading={
                                resultCreate.isLoading || resultUpdate.isLoading
                            }
                        >
                            Update
                        </Button>
                    </div>
                </form>
            </Card.Section>
        </Card>
    );
};

export default Stripe;
