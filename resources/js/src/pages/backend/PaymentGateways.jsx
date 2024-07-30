import React from "react";
import Paypal from "../../components/backend/PaymentGateways/Paypal";
import Stripe from "../../components/backend/PaymentGateways/Stripe";
import BackendLayout from "../../layouts/BackendLayout";

const PaymentGateways = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 items-start gap-4">
            <Paypal />
            <Stripe />
        </div>
    );
};

PaymentGateways.layout = (page) => <BackendLayout children={page} />;
export default PaymentGateways;
