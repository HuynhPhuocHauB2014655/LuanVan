import { createBrowserRouter } from "react-router-dom";
import Home from './views/Home.jsx';
import Student from './views/Student.jsx';
import Layout from "./components/Layout.jsx";
import HK_NK from "./views/HK_NK.jsx";
import Subject from "./views/Subject.jsx";
import Teacher from "./views/Teacher.jsx";


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
                path: "*",
                element: <div>404 - Page not found</div>,
            },

        ]
    },
])

export default router;