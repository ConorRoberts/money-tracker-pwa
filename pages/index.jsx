import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@components/FormComponents";
import Link from "next/link";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "@components/Loading";

const GET_USER_DATA = gql`
  query getUserData($id: String!) {
    get_user_transactions(id: $id) {
      id
      note
      category
      amount
      creator
      created_at
      taxable
    }
  }
`;

export default function Home() {
  const { user, isLoading } = useUser();

  const [timePeriod, setTimePeriod] = useState("week");

  const { data } = useQuery(GET_USER_DATA, { variables: { id: user?.sub } });

  if (isLoading) return <Loading />;

  return (
    <div className="bg-gray-900 flex items-center h-screen flex-col">
      <p className="text-4xl text-white font-sans">$ 12,567</p>
      <div className="flex flex-row gap-x-5">
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Inc:</p>
          <p className="text-green-500">$15,500</p>
        </div>
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Exp:</p>
          <p className="text-red-500">$2,933</p>
        </div>
      </div>

      {/* {array.map((e) => (
        //code here
      ))} */}

      <div name="graph">
        <p className="text-9xl text-white text-bold">GRAPH</p>
      </div>

      <div name="transactions" className="box-content h-24 w-3/4 p-4 border-2 border-gray-800 rounded-full py-3 px-6 bg-gray-700">

      </div>

    </div>
  );
}