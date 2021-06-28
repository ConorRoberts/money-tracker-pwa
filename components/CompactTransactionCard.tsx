import React from "react";
import Link from "next/link";
import categories from "@utils/categories";

export default function CompactTransactionCard({ id, amount, category, type }) {
  const Icon = categories[category]?.Icon ?? categories["other"].Icon
  return (
    <Link href={`/transaction-form/edit/${id}`}>
      <div className="bg-gray-700 rounded-lg py-3 px-4 flex flex-col items-center gap-1 shadow-md relative hover:bg-green-700 transition cursor-pointer">
        <div className="rounded-full bg-gray-600 p-5 flex justify-center items-center border border-gray-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3
            className={`${type === "revenue" ? "text-green-500" : "text-red-500"} font-normal ${amount > 10000 ? "text-base" : "text-xl"}`}
          >{`$${amount.toLocaleString()}`}</h3>
        </div>
      </div>
    </Link>
  );
}
