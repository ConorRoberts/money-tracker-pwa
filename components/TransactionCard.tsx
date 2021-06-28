import React from "react";
import Link from "next/link";
import categories from "@utils/categories";
import type Transaction from "@typedefs/transaction";

export default function TransactionCard({
  id,
  amount,
  created_at,
  category,
  type,
  description
}: Transaction) {
  const Icon = categories[category]?.Icon ?? categories["other"].Icon
  return (
    <Link passHref href={`/transaction-form/edit/${id}`}>
      <div className="bg-gray-700 rounded-md p-2 flex items-center shadow-md gap-5 sm:flex-none relative hover:bg-green-700 transition cursor-pointer">
        <div className="rounded-full bg-gray-600 p-4 flex justify-center items-center border border-gray-500">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col justify-evenly flex-1">
          <h3
            className={`${type === "revenue" ? "text-green-500" : "text-red-500"} font-normal text-2xl`}
          >{`$${amount.toLocaleString()}`}</h3>
          {description && <p className="text-white text-sm capitalize">{description}</p>}
          <p className="text-white text-sm">
            {new Date(created_at).toDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
}
