import React from "react";
import Link from "next/link";
import { Button } from "@components/FormComponents";
import Header from "@components/Header";

const ROUTES = [
  {
    label: "Logout",
    path: "/api/auth/signout",
  },
  {
    label: "Import Data",
    path: "/misc/import-data",
  },
];

export default function Misc() {
  return (
    <div className="bg-gray-900 flex-1 flex justify-center items-center">
      <Header title="Misc" />
      <div className="flex flex-col gap-6">
        {ROUTES.map(({ label, path }, index) => (
          <Link passHref href={path} key={`route-${index}`}>
            <Button className="box-border border rounded-sm bg-gray-800 hover:bg-gray-600 transition-all cursor-pointer text-white font-thin text-lg flex py-4 px-6 justify-between text-center">
              {label}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
}
