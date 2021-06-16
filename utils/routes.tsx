import { HiHome as Home } from "react-icons/hi";

interface Route {
    path: string,
    text: string,
    Icon: any
}

export const ROUTES: [Route] = [
    {
        path: "/",
        text: "Home",
        Icon: <Home/>,
    },
];
export const LOGGED_IN_LINKS = [
    {
        path: "/transaction-form/new",
        text: "New",
        Icon: <Home/>,
    },
    // {
    //     path: "/misc",
    //     text: "Misc",
    //     Icon: "/Person.svg",
    // },
];
export const LOGGED_OUT_LINKS = [
    {
        path: "/login",
        text: "Login",
        Icon: <Home/>,
    },
];