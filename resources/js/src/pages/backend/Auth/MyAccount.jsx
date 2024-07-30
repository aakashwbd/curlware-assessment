import { Card, Text } from "@mantine/core";
import React from "react";
import GeneralForm from "../../../components/backend/MyAccount/GeneralForm";
import PasswordForm from "../../../components/backend/MyAccount/PasswordForm";
import BackendLayout from "../../../layouts/BackendLayout";

const MyAccount = () => {
    const tab = new URLSearchParams(window.location.search).get("tab");

    return (
        <Card withBorder shadow="sm" w={{ base: "100%", lg: "50%" }}>
            <Card.Section inheritPadding py="sm" withBorder>
                <Text>
                    {tab === "general_information" && "General Information"}
                    {tab === "password" && "Password"}
                </Text>
            </Card.Section>
            <Card.Section inheritPadding py="sm" withBorder>
                {tab === "general_information" && <GeneralForm />}
                {tab === "password" && <PasswordForm />}
            </Card.Section>
        </Card>
    );
};

MyAccount.layout = (page) => <BackendLayout children={page} />;

export default MyAccount;
