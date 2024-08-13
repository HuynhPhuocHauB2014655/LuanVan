import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home.jsx';
import Layout from "./components/Layout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Info from "./views/Info.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <Home />,
            },
            {
                path: "/info",
                element: <Info />,
            },
        ]
    },
    {
        path: "/login",
        element: <GuestLayout />,
    },
    {
        path: "*",
        element: <div>404 - Page not found</div>,
    },
])

export default router;