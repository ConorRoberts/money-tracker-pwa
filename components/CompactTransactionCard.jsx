import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/FormComponents";
import categories from "@utils/categories";

export default function CompactTransactionCard({ id, amount, category, type }) {
  return (
    <Link href={`/transaction-form/edit/${id}`}>
      <div className="bg-gray-700 rounded-lg p-2 flex flex-col items-center gap-1 shadow-md w-36 relative hover:bg-green-700 transition cursor-pointer">
        <div className="rounded-full bg-gray-300 p-5 flex justify-center items-center">
          <Image
            width={20}
            height={20}
            src={categories[category]?.image ?? categories["other"].image}
          />
        </div>
        <div>
          <h3
            className={`text-${
              type === "revenue" ? "green" : "red"
            }-500 font-normal text-xl`}
          >{`$${amount.toFixed(2)}`}</h3>
        </div>
      </div>
    </Link>
  );
}
