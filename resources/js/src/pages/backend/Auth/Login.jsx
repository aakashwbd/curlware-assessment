import { Icon } from "@iconify/react/dist/iconify.js";
import { router } from "@inertiajs/react";
import {
    ActionIcon,
    Box,
    Button,
    Checkbox,
    CopyButton,
    Flex,
    Image,
    Table,
    Text,
    Tooltip,
} from "@mantine/core";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import Validator from "Validator";
import PasswordBox from "../../../components/ui/PasswordBox";
import TextBox from "../../../components/ui/TextBox";
import { images } from "../../../constants/images";
import { useLoginMutation } from "../../../store/api/slices/authSlice";
import { setCurrentUser } from "../../../store/reducers/authReducer";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";

const Login = () => {
    const dispatch = useDispatch();
    const [login, result] = useLoginMutation();

    const [form, setForm] = useState({
        email: "",
        password: "",
        remember_me: false,
    });

    const [errors, setErrors] = useState({
        email: { text: "", show: false },
        password: { text: "", show: false },
        remember_me: { text: "", show: false },
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
            router.visit(`${window.origin}/admin/dashboard`);
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
            email: "required|email:filter",
            password: "required|min:6",
            remember_me: "required|boolean",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await login(form);
            callbackHandler(data, error);
        }
    };

    return (
        <Flex>
            <Image
                src={images.LOGIN_BG}
                w={{ base: "100%", md: "50%" }}
                mih="100vh"
                h="100%"
                visibleFrom="md"
            />
            <Flex
                direction="column"
                justify="center"
                w={{ base: "100%", md: "50%" }}
                mih="100vh"
                h="100%"
                p="xl"
            >
                <Box w={{ base: "100%", md: "50%" }}>
                    <Text size="xl" fw={600} c="#9C82BF">
                        WELCOME TO ECOMMERCE
                    </Text>
                    <Text size="sm" c="dimmed" mb="xs">
                        Login to your account.
                    </Text>

                    <form
                        className="flex flex-col gap-2"
                        onSubmit={submitHandler}
                    >
                        <TextBox
                            label="Email"
                            withAsterisk
                            value={form.email}
                            onChange={(e) =>
                                fieldChangeHandler("email", e.target.value)
                            }
                            error={errors.email.text}
                            placeholder="john@doe.com"
                        />
                        <PasswordBox
                            label="Password"
                            withAsterisk
                            value={form.password}
                            onChange={(e) =>
                                fieldChangeHandler("password", e.target.value)
                            }
                            error={errors.password.text}
                            placeholder="Password"
                        />
                        <Checkbox
                            label="Remember me"
                            checked={form.remember_me}
                            onChange={(e) =>
                                fieldChangeHandler(
                                    "remember_me",
                                    e.target.checked
                                )
                            }
                            error={errors.remember_me.text}
                            mt="xs"
                            size="xs"
                            color="#9C82BF"
                        />
                        <Button
                            type="submit"
                            loading={result.isLoading}
                            color="#9C82BF"
                            mt="xs"
                        >
                            LOGIN
                        </Button>
                    </form>

                    <Table withTableBorder withColumnBorders mt="xl">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Td>Email</Table.Td>
                                <Table.Td>Password</Table.Td>
                                <Table.Td>Action</Table.Td>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Td>admin@example.com</Table.Td>
                                <Table.Td>123456</Table.Td>
                                <Table.Td>
                                    <CopyButton timeout={4000}>
                                        {({ copied, copy }) => (
                                            <Tooltip
                                                label={
                                                    copied ? "Copied" : "Copy"
                                                }
                                                withArrow
                                                position="right"
                                            >
                                                <ActionIcon
                                                    color={
                                                        copied
                                                            ? "#9C82BF"
                                                            : "gray"
                                                    }
                                                    variant="subtle"
                                                    onClick={() => {
                                                        copy();
                                                        setForm(
                                                            (prevState) => ({
                                                                ...prevState,
                                                                email: "admin@example.com",
                                                                password:
                                                                    "123456",
                                                                remember_me: true,
                                                            })
                                                        );
                                                    }}
                                                >
                                                    <Icon
                                                        icon={
                                                            copied
                                                                ? "lucide:check-circle"
                                                                : "mage:copy"
                                                        }
                                                    />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                </Box>
            </Flex>
        </Flex>
    );
};

export default Login;
