import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@components/FormComponents";
import categories from "@utils/categories";

export default function CompactTransactionCard({
  id,
  amount,
  note,
  created_at,
  category,
  type,
}) {
  return (
    <div className="bg-gray-700 rounded-lg p-2 flex items-center gap-5 shadow-md flex-auto sm:flex-none sm:w-96 relative">
      <div className="rounded-full bg-gray-300 p-5 flex justify-center items-center">
        <Image
          width={20}
          height={20}
          src={categories[category]?.image ?? categories["other"].image}
        />
      </div>
      <div className="flex flex-col justify-evenly flex-1">
        <h3
          className={`text-${
            type === "revenue" ? "green" : "red"
          }-500 font-normal text-2xl`}
        >{`$${amount.toFixed(2)}`}</h3>
        <p className="text-white text-md">{note}</p>
        <p className="text-white text-sm">
          {new Date(created_at).toDateString()}
        </p>
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
}
