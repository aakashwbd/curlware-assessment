import Cookies from "js-cookie";
import Swal from "sweetalert2";

export const paramsChangeHandler = (field, value, setter) => {
    setter((prevState) => ({ ...prevState, [field]: value }));
};

export const validateErrorGenerator = (data, setter) => {
    let validate = {};
    Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
            validate[key] = { text: data[key][0], show: true };
        } else {
            validate[key] = { text: data[key], show: true };
        }
    });
    setter((prevState) => ({
        ...prevState,
        ...validate,
    }));
};

export const tableIndex = (from, index) => {
    return from + index;
};

export const tokenSetter = (headers) => {
    let token = Cookies.get("authToken") || null;
    if (token) {
        headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
};

export const alertMessage = (props) => {
    Swal.fire(props);
};

export const deleteAlertMessage = (cb = () => {}, title = "Yes, Delete it") => {
    Swal.fire({
        title: "Are you sure?",
        text: "Do you want to continue?",
        icon: "question",
        confirmButtonText: title,
        showCancelButton: true,
        focusCancel: true,
    }).then(({ isConfirmed }) => {
        if (isConfirmed) {
            cb();
        }
        return false;
    });
};

export const deleteHandler = (id, refetch, deleteMutation) => {
    deleteAlertMessage(async () => {
        let { data, error } = await deleteMutation(id);
        if (data) {
            refetch();
            alertMessage({
                title: data.message,
                icon: "success",
                timer: 1500,
            });
        } else if (error) {
            alertMessage({
                title: error.message,
                icon: "error",
                timer: 2500,
            });
        }
    });
};

export const dialogOpenHandler = (
    open = () => {},
    id = null,
    setSelectedId = () => {},
    setSkip = () => {}
) => {
    if (id) {
        setSelectedId(id);
        setSkip(false);
    }
    open();
};

export const dialogCloseHandler = (
    close = () => {},
    setSelectedId = () => {},
    setSkip = () => {}
) => {
    setSelectedId(null);
    setSkip(true);
    close();
};

export const getStatus = (status) => {
    switch (status) {
        case "active":
        case "accepted":
            return "green";

        case "inactive":
        case "rejected":
            return "red";

        case "draft":
            return "dark";

        case "pending":
            return "yellow";

        case "renewal":
            return null;
    }
};

export const mappedSelectData = (data = [], label = "", value = "") => {
    return data?.map((item) => {
        return {
            label: item[label],
            value:
                typeof item[value] === "string"
                    ? item[value]
                    : item[value]?.toString(),
        };
    });
};

export const imageUrlBuilder = (attachments, defaultImage) => {
    if (attachments) {
        if (typeof attachments !== "string" && attachments.length) {
            return window.origin + "/" + attachments[0];
        } else if (typeof attachments === "string") {
            return window.origin + "/" + attachments;
        }
    }
    return defaultImage;
};
