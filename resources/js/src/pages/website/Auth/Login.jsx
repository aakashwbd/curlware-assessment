import { Icon } from "@iconify/react/dist/iconify.js";
import { Link, router } from "@inertiajs/react";
import {
    ActionIcon,
    Anchor,
    Box,
    Button,
    Flex,
    Group,
    Text,
    Tooltip,
} from "@mantine/core";
import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Validator from "Validator";
import PasswordBox from "../../../components/ui/PasswordBox";
import TextBox from "../../../components/ui/TextBox";
import AuthLayout from "../../../layouts/AuthLayout";
import { useLoginMutation } from "../../../store/api/slices/authSlice";
import { setCurrentUser } from "../../../store/reducers/authReducer";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";

const Login = () => {
    const dispatch = useDispatch();
    const [login, result] = useLoginMutation();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({
        email: { text: "", show: false },
        password: { text: "", show: false },
    });

    const fieldChangeHandler = (field, value) => {
        setErrors((prevState) => ({
            ...prevState,
            [field]: { text: "", show: false },
        }));
        setForm((prevState) => ({ ...prevState, [field]: value }));
    };

    const callbackHandler = (data = null, error = null) => {
        if (data) {
            dispatch(setCurrentUser(data?.data?.user));
            Cookies.set("authToken", data.data.token, { expires: 3600 });
            Cookies.set("user", JSON.stringify(data.data.user), {
                expires: 3600,
            });
            alertMessage({ title: data.message, icon: "success", timer: 1500 });

            router.visit("/");
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
            email: "required|email:filter",
            password: "required|min:6",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await login(form);
            callbackHandler(data, error);
        }
    };

    const oAuthLoginHandler = async (provider) => {
        const response = await axios.get(
            `${window.origin}/api/v1/auth/oauth-login/${provider}`
        );
        window.open(response.data.data, "_self");
    };

    return (
        <Box w={{ base: "100%", lg: "50%" }}>
            <Flex direction="column" justify="center" align="center">
                <Text
                    size="xl"
                    fw={600}
                    c="#9C82BF"
                    className="!font-secondary"
                >
                    WELCOME BACK !
                </Text>
                <Text size="sm" c="dimmed" mb="xs">
                    Login to your account.
                </Text>
            </Flex>
            <form className="flex flex-col gap-2" onSubmit={submitHandler}>
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
                <Button
                    type="submit"
                    loading={result.isLoading}
                    leftSection={
                        <Icon icon="material-symbols-light:login-rounded" />
                    }
                    color="#9C82BF"
                    mt="xs"
                >
                    Login
                </Button>
            </form>

            <Text ta="center" mt="sm" size="sm" c="dimmed">
                Or Login With
            </Text>

            <Group my="sm" justify="center">
                <Tooltip label="Google" withArrow>
                    <ActionIcon
                        variant="default"
                        radius="xl"
                        size="md"
                        onClick={() => oAuthLoginHandler("google")}
                    >
                        <Icon icon="devicon:google" />
                    </ActionIcon>
                </Tooltip>
            </Group>
            <Text ta="center" size="sm" c="dimmed">
                Don't have an account!{" "}
                <Anchor component={Link} href="/register" c="#9C82BF">
                    Register
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

Login.layout = (page) => <AuthLayout children={page} />;
export default Login;
