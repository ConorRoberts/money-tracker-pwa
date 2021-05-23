import React from "react";
import Image from "next/image";

export const categories = {
  groceries: "/Card_Grocery.svg",
  clothing: "/Card_Clothes.svg",
  "office expense": "/Card_Office.svg",
  other: "/Card_Other.svg",
  "maintenance & repairs": "/Card_Repairs.svg",
  revenue: "/Card_Revenue.svg",
  travel: "/Card_Travel.svg",
  technology: "/Card_Technology.svg",
  rent: "/Card_Rent.svg",
  eating: "/Card_Eating.svg",
  "meals & entertainment": "/Card_Entertainment.svg",
};

const TransactionCard = ({ amount, note, created_at, category,type }) => {
  return (
    <div className="bg-gray-700 rounded-lg p-5 flex items-center gap-5 shadow-md">
      <div className="rounded-full bg-gray-400 p-6 flex justify-center items-center">
        <Image
          width={25}
          height={25}
          src={categories[category] ?? categories["other"]}
        />
      </div>
      <div className="flex flex-col justify-evenly flex-1">
        <h3
          className={`text-${
            type === "revenue" ? "green" : "red"
          }-500 font-base text-2xl`}
        >{`$${amount.toFixed(2)}`}</h3>
        <h4 className="text-white">{note}</h4>
        <p className="text-white">{new Date(created_at).toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TransactionCard;
