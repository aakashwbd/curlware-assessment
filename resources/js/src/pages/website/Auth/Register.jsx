import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, router } from "@inertiajs/react";
import { Anchor, Box, Button, Flex, Group, Text } from "@mantine/core";
import React, { useState } from "react";
import Validator from "Validator";
import PasswordBox from "../../../components/ui/PasswordBox";
import TextBox from "../../../components/ui/TextBox";
import AuthLayout from "../../../layouts/AuthLayout";
import { useRegisterMutation } from "../../../store/api/slices/authSlice";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";

const Register = () => {
    const [register, result] = useRegisterMutation();
    const [form, setForm] = useState({
        type: "customer",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState({
        type: { text: "", show: false },
        name: { text: "", show: false },
        email: { text: "", show: false },
        password: { text: "", show: false },
        password_confirmation: { text: "", show: false },
    });

    const fieldChangeHandler = (field, value) => {
        setErrors((prevState) => ({
            ...prevState,
            [field]: { text: "", show: false },
        }));
        setForm((prevState) => ({ ...prevState, [field]: value }));
    };

    const resetHandler = () => {
        setErrors({
            type: { text: "", show: false },
            name: { text: "", show: false },
            email: { text: "", show: false },
            password: { text: "", show: false },
            password_confirmation: { text: "", show: false },
        });
        setForm({
            type: "customer",
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });
    };

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            resetHandler();
            alertMessage({ title: data.message, icon: "success", timer: 1500 });
            router.visit(`${window.origin}/login`);
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
            type: "required|in:customer",
            name: "required",
            email: "required|email:filter",
            password: "required|min:6|confirmed",
            password_confirmation: "required|min:6",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await register(form);
            callbackHandler(data, error);
        }
    };

    return (
        <Box w={{ base: "100%", lg: "50%" }}>
            <Text ta="center" size="xl" fw={600} c="#9C82BF">
                CREATE AN ACCOUNT.
            </Text>
            <form className="flex flex-col gap-2" onSubmit={submitHandler}>
                <TextBox
                    label="Name"
                    withAsterisk
                    value={form.name}
                    onChange={(e) => fieldChangeHandler("name", e.target.value)}
                    error={errors.name.text}
                />
                <TextBox
                    label="Email"
                    withAsterisk
                    value={form.email}
                    onChange={(e) =>
                        fieldChangeHandler("email", e.target.value)
                    }
                    error={errors.email.text}
                />
                <PasswordBox
                    label="Password"
                    withAsterisk
                    value={form.password}
                    onChange={(e) =>
                        fieldChangeHandler("password", e.target.value)
                    }
                    error={errors.password.text}
                />
                <PasswordBox
                    label="Re-Type Password"
                    withAsterisk
                    value={form.password_confirmation}
                    onChange={(e) =>
                        fieldChangeHandler(
                            "password_confirmation",
                            e.target.value
                        )
                    }
                    error={errors.password_confirmation.text}
                />
                <Button
                    type="submit"
                    loading={result.isLoading}
                    color="#9C82BF"
                    mt="xs"
                >
                    Register
                </Button>
            </form>

            <Text ta="center" size="sm" c="dimmed" mt="sm">
                Already have an account?{" "}
                <Anchor component={Link} href="/login" c="#9C82BF">
                    Login
                </Anchor>
            </Text>

            <Group justify="center" mt="xl">
                <Icon icon="fluent-mdl2:back" />
                <Anchor component={Link} href="/" c="pink">
                    Back to Home
                </Anchor>
            </Group>
        </Box>
    );
};

Register.layout = (page) => <AuthLayout children={page} />;
export default Register;
