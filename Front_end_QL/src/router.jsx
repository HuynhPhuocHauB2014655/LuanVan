import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home.jsx';
import Student from './views/Student.jsx';
import Layout from "./components/Layout.jsx";
import HK_NK from "./views/HK_NK.jsx";
import Subject from "./views/Subject.jsx";
import Teacher from "./views/Teacher.jsx";
import Class from "./views/Class.jsx";
import TKB from "./views/TKB.jsx";
import GuestLayout from "./components/GuestLayout.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/home",
                element: <Home />,
            },
            {
                path: "/student",
                element: <Student />,
            },
            {
                path: "/nk",
                element: <HK_NK/>
            },
            {
                path: "/subject",
                element: <Subject/>,
            },
            {
                path: "/teacher",
                element: <Teacher/>,
            },
            {
                path: "/class",
                element: <Class/>,
            },
            {
                path: "/tkb",
                element: <TKB/>,
            },
            {
                path: "*",
                element: <div>404 - Page not found</div>,
            },
        ]
    },
    {
        path: "/login",
        element: <GuestLayout />,
    }
])

export default router;