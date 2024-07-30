import { usePage } from "@inertiajs/react";
import { Button, Card, Checkbox, Text } from "@mantine/core";
import React, { useEffect, useState } from "react";
import Validator from "Validator";
import { AppSkeleton } from "../../../components/ui/AppSkeleton";
import BackendLayout from "../../../layouts/BackendLayout";
import {
    useAssignPermissionMutation,
    useFetchAssignedPermissionsQuery,
    useFetchPermissionsQuery,
} from "../../../store/api/slices/roleSlice";
import { alertMessage, validateErrorGenerator } from "../../../utils/Helpers";

const Permissions = () => {
    const { props } = usePage();
    const [create, result] = useAssignPermissionMutation();
    const { isFetching, data } = useFetchPermissionsQuery();
    const { data: payload } = useFetchAssignedPermissionsQuery(
        `user_role_id=${props.id}`,
        { skip: !props.id, refetchOnMountOrArgChange: true }
    );

    const [form, setForm] = useState({
        role_id: props.id,
        permissions: [],
    });

    const [errors, setErrors] = useState({
        role_id: { text: "", show: false },
        permissions: { text: "", show: false },
    });

    const permissionChangeHandler = (value, checked) => {
        let permissionArr = [...form.permissions];
        if (checked) {
            permissionArr.push(value);
        } else {
            permissionArr = permissionArr.filter((item) => item !== value);
        }

        setErrors((prevState) => ({
            ...prevState,
            permissions: { text: "", show: false },
        }));

        setForm((prevState) => ({
            ...prevState,
            permissions: permissionArr,
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

        let validation = await Validator.make(form, {
            role_id: "required",
            permissions: "required|array",
        });

        if (validation.fails()) {
            let errors = validation.getErrors();
            validateErrorGenerator(errors, setErrors);
        } else {
            let { data, error } = await create(form);
            callbackHandler(data, error);
        }
    };

    useEffect(() => {
        if (payload && payload.length) {
            setForm({
                role_id: props.id,
                permissions: payload,
            });
        }
    }, [payload]);

    return (
        <Card withBorder shadow="sm" w={{ base: "100%", lg: "50%" }}>
            <Card.Section inheritPadding py="sm" withBorder>
                <Text>Manage Permissions</Text>
            </Card.Section>
            <Card.Section inheritPadding py="sm" withBorder>
                {isFetching ? (
                    <AppSkeleton />
                ) : (
                    <form onSubmit={submitHandler}>
                        {data?.map((item, i) => (
                            <Checkbox
                                label={item?.name}
                                key={i}
                                mb="xs"
                                checked={form.permissions.some(
                                    (pItem) => pItem === item?.id
                                )}
                                onChange={(e) =>
                                    permissionChangeHandler(
                                        item?.id,
                                        e.target.checked
                                    )
                                }
                                color="#9C82BF"
                            />
                        ))}
                        {errors.permissions.show && (
                            <Text size="xs" c="red" my="xs">
                                {errors.permissions.text}
                            </Text>
                        )}
                        <Button
                            color="#9C82BF"
                            type="submit"
                            loading={result.isLoading}
                        >
                            Update
                        </Button>
                    </form>
                )}
            </Card.Section>
        </Card>
    );
};

Permissions.layout = (page) => <BackendLayout children={page} />;
export default Permissions;
