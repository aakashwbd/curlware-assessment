import React from "react";
import SummaryBox from "../../components/backend/Dashboard/SummaryBox";
import BackendLayout from "../../layouts/BackendLayout";
import { useFetchSummaryQuery } from "../../store/api/slices/reportSlice";
import { NumberFormatter } from "@mantine/core";
import PaymentChart from "../../components/backend/Dashboard/PaymentChart";

const Dashboard = () => {
    const { isFetching, data } = useFetchSummaryQuery();
    return (
        <div className="grid grid-cols-1 lg:!grid-cols-5 gap-4 items-start">
            <SummaryBox
                isLoading={isFetching}
                label="Total Customer"
                value={data?.total_customer}
                icon="oui:users"
            />
            <SummaryBox
                isLoading={isFetching}
                label="Total Products"
                value={data?.total_product}
                icon="gridicons:product"
            />
            <SummaryBox
                isLoading={isFetching}
                label="Total Category"
                value={data?.total_category}
                icon="tabler:category"
            />
            <SummaryBox
                isLoading={isFetching}
                label="Total Order"
                value={data?.total_order}
                icon="material-symbols:order-approve-sharp"
            />
            <SummaryBox
                isLoading={isFetching}
                label="Total Sale"
                value={
                    <NumberFormatter
                        value={data?.total_payment}
                        thousandSeparator
                    />
                }
                icon="bx:money-withdraw"
            />

            <PaymentChart
                isLoading={isFetching}
                data={data?.payment_summary_by_method}
            />
        </div>
    );
};

Dashboard.layout = (page) => <BackendLayout children={page} />;
export default Dashboard;
