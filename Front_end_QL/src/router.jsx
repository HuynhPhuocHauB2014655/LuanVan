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
import Account from "./views/Account.jsx";
import Result from "./views/Result.jsx";
import ClassInfo from "./views/ClassInfo.jsx";
import StudentResult from "./views/StudentResult.jsx";
import Notification from "./views/Notification.jsx";
import StudentInfo from "./views/StudentInfo.jsx";
import TestFileUpload from "./views/TestFileUpload.jsx";
import Message from "./views/Message.jsx";


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
                path: "/account",
                element: <Account/>,
            },
            {
                path: "/rs",
                element: <Result/>,
            },
            {
                path: "/class-info",
                element: <ClassInfo/>,
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
                path: "/notify",
                element: <Notification/>,
            },
            {
                path: "/ms",
                element: <Message/>,
            },
        ]
    },
    {
        path: "/login",
        element: <GuestLayout />,
    },
    {
        path: "/file",
        element: <TestFileUpload />,
    },
    {
        path: "*",
        element: <div>404 - Page not found</div>,
    },
])

export default router;