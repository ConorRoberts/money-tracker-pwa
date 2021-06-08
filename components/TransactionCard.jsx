import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/FormComponents";

export const categories = {
  groceries: { image: "/Card_Grocery.svg", colour: "#f2bd2c" },
  clothing: { image: "/Card_Clothes.svg", colour: "#5d32a8" },
  "office expense": { image: "/Card_Office.svg", colour: "#ffdc7d" },
  other: { image: "/Card_Other.svg", colour: "#a6334a" },
  "maintenance & repairs": { image: "/Card_Repairs.svg" },
  revenue: { image: "/Card_Revenue.svg", colour: "#47ba79" },
  travel: { image: "/Card_Travel.svg", colour: "#03dffc" },
  technology: { image: "/Card_Technology.svg", colour: "#3244a8" },
  rent: { image: "/Card_Rent.svg", colour: "#59b4ff" },
  eating: { image: "/Card_Eating.svg", colour: "#5988ff" },
  "meals & entertainment": {
    image: "/Card_Entertainment.svg",
    colour: "#9432a8",
  },
};

const TransactionCard = ({ id, amount, note, created_at, category, type }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-4 flex items-center gap-5 shadow-md flex-auto sm:flex-none sm:w-96 relative">
      <div className="rounded-full bg-gray-300 p-6 flex justify-center items-center">
        <Image
          width={25}
          height={25}
          src={categories[category]?.image ?? categories["other"].image}
        />
      </div>
      <div className="flex flex-col justify-evenly flex-1">
        <h3
          className={`text-${
            type === "revenue" ? "green" : "red"
          }-500 font-base text-2xl`}
        >{`$${amount.toFixed(2)}`}</h3>
        <h4 className="text-white">{note}</h4>
        <p className="text-white">{new Date(created_at).toDateString()}</p>
        <div className="absolute top-1 right-1">
          <Link passHref href={`/transaction-form/edit/${id}`}>
            <a>
              <Button
                type="button"
                className="px-3 py-2 hover:bg-gray-400 transition-all"
              >
                <Image src="/Pencil_White.svg" width={15} height={15} />
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
