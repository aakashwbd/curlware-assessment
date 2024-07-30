export const List = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: "fluent-mdl2:b-i-dashboard",
        items: [],
    },
    {
        label: "Manage Products",
        icon: "fluent-mdl2:product-variant",
        path: "",
        items: [
            {
                label: "Add New Product",
                path: "/admin/products/create",
                items: [],
            },
            { label: "All Products", path: "/admin/products", items: [] },
            {
                label: "Categories",
                path: "/admin/categories",
                items: [],
            },
        ],
    },
    {
        label: "Sales",
        icon: "mdi:point-of-sale",
        path: "",
        items: [
            {
                label: "Orders",
                path: "/admin/orders",
                items: [],
            },
            {
                label: "Transections",
                path: "/admin/transactions",
                items: [],
            },
        ],
    },
    {
        label: "Manage Employee",
        icon: "eos-icons:admin-outlined",
        path: "",
        items: [
            { label: "Employees", path: "/admin/employees", items: [] },
            {
                label: "Roles & Permissions",
                path: "/admin/roles",
                items: [],
            },
        ],
    },
    {
        label: "Settings",
        icon: "clarity:settings-line",
        path: "",
        items: [
            {
                label: "Payment Gateway",
                path: "/admin/payment-gateway",
                items: [],
            },
        ],
    },
];
