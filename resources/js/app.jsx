import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./src/store";
import { setSkin } from "./src/store/reducers/siteReducer";

const AppProvider = ({ children }) => {
    const dispatch = useDispatch();
    const { skin } = useSelector((state) => state.site);

    useEffect(() => {
        let getSkin = localStorage.getItem("skin") || "light";
        if (getSkin) {
            dispatch(setSkin(getSkin));
        }
    }, []);

    return (
        <>
            <ColorSchemeScript forceColorScheme={skin} />
            <MantineProvider forceColorScheme={skin}>
                {children}
            </MantineProvider>
        </>
    );
};

createInertiaApp({
    resolve: (name) => {
        const src = import.meta.glob("./src/**/*.jsx", { eager: true });
        return src[`./src/${name}.jsx`];
    },

    setup({ el, App, props }) {
        createRoot(el).render(
            <Provider store={store}>
                <AppProvider children={<App {...props} />} />
            </Provider>
        );
    },

    progress: {
        delay: 250,
        color: "#29d",
        includeCSS: true,
        showSpinner: true,
    },
});
