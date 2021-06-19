import { AiOutlinePlus as PlusIcon,AiOutlineSearch as SearchIcon } from "react-icons/ai";
import { IoMdHome as HomeIcon } from "react-icons/io";
import { BsThreeDots as MiscIcon, BsFillPersonFill as PersonIcon } from "react-icons/bs";

interface Route {
    path: string,
    text: string,
    Icon: any
}

export const ROUTES: Route[] = [
    {
        path: "/",
        text: "Home",
        Icon: HomeIcon,
    },
];
export const LOGGED_IN_LINKS: Route[] = [
    {
        path: "/transaction-form/new",
        text: "New",
        Icon: PlusIcon,
    },
    {
        path: "/search",
        text: "Search",
        Icon: SearchIcon,
    },
    {
        path: "/misc",
        text: "Misc",
        Icon: MiscIcon,
    },
];
export const LOGGED_OUT_LINKS: Route[] = [
    {
        path: "/login",
        text: "Login",
        Icon: PersonIcon,
    },
];