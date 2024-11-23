import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home.jsx';
import Layout from "./components/Layout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Info from "./views/Info.jsx";
import TKB from "./views/TKB.jsx";
import Result from "./views/Result.jsx";
import Notification from "./views/Notification.jsx";
import Message from "./views/Message.jsx";
import LoginPH from "./views/LoginPH.jsx";
import GroupChatPH from "./views/GroupChatPH.jsx";
import NienKhoa from "./views/NienKhoa.jsx";


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
            {
                path: "/tkb",
                element: <TKB/>
            },
            {
                path: "/result",
                element: <Result/>
            },
            {
                path: "/notify",
                element: <Notification/>
            },
            {
                path: "/tn",
                element: <Message/>
            },
            {
                path: "/ph",
                element: <GroupChatPH />,
            },
            {
                path: "/nk",
                element: <NienKhoa/>
            }
        ]
    },
    {
        path: "/login",
        element: <GuestLayout />,
    },
    {
        path: "/loginPH",
        element: <LoginPH />,
    },
    {
        path: "*",
        element: <div>404 - Page not found</div>,
    },
])

export default router;