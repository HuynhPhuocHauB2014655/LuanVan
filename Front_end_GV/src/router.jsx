import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home.jsx';
import Layout from "./components/Layout.jsx";
import GuestLayout from "./components/GuestLayout.jsx";
import Info from "./views/Info.jsx";
import Homeroom from "./views/Homeroom.jsx";
import Class from "./views/Class.jsx";
import ClassInfo from "./views/ClassInfo.jsx";
import TKB from "./views/TKB.jsx";
import Notification from "./views/Notification.jsx";
import Message from "./views/Message.jsx";
import StudentResult from "./views/StudentResult.jsx";
import StudentInfo from "./views/StudentInfo.jsx";
import Teaching from "./views/Teach.jsx";
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
                path: "/cn",
                element: <Homeroom />,
            },
            {
                path: "/class",
                element: <Class />,
            },
            {
                path: "/class-info",
                element: <ClassInfo />,
            },
            {
                path: "/tkb",
                element: <TKB />,
            },
            {
                path: "/tb",
                element: <Notification/>,
            },
            {
                path: "/teach",
                element: <Teaching />,
            },
            {
                path: "/ms",
                element: <Message />,
            },
            {
                path: "/student-result",
                element: <StudentResult/>,
            },
            {
                path: "/student-info",
                element: <StudentInfo/>,
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
        path: "*",
        element: <div>404 - Page not found</div>,
    },
])

export default router;