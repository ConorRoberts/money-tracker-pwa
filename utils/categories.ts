import { FaRegMoneyBillAlt as MoneyIcon } from "react-icons/fa";
import { BsThreeDots as OtherIcon, BsWrench as WrenchIcon } from "react-icons/bs";
import { MdComputer as ComputerIcon } from "react-icons/md";
import { GiAirplaneDeparture as PlaneIcon, GiHouse as HouseIcon } from "react-icons/gi";
import { IoFastFoodOutline as FoodIcon } from "react-icons/io5";

const categories = {
    "office expense": {
        Icon: ComputerIcon,
        type: "expense"
    },
    other: {
        Icon: OtherIcon,
        type: "expense"
    },
    "maintenance & repairs": {
        Icon: WrenchIcon,
        type: "expense"
    },
    revenue: {
        Icon: MoneyIcon,
        type: "revenue"
    },
    travel: {
        Icon: PlaneIcon,
        type: "expense"
    },
    rent: {
        Icon: HouseIcon,
        type: "expense"
    },
    "meals & entertainment": {
        Icon: FoodIcon,
        type: "expense"
    },
};

export default categories;