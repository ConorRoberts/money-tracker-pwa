import { useUser } from "@auth0/nextjs-auth0";
import { Button } from "@components/FormComponents";
import { useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
      type
    }
  }
`;

export default function Home() {
  const { user, isLoading } = useUser();

  const [timePeriod, setTimePeriod] = useState("week");

  const { data } = useQuery(GET_USER_DATA, { variables: { id: user?.sub } });

  if (isLoading) return <Loading />;

  console.log(data);

  const revenue_total = data?.get_user_transactions
    .filter(({ category }) => category.toLowerCase() == "revenue")
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);

  const expense_total = data?.get_user_transactions
    .filter(({ category }) => category.toLowerCase() !== "revenue")
    .map((e) => e.amount)
    .reduce((a, b) => a + b, 0);

  return (
    <div className="bg-gray-900 flex items-center min-h-screen flex-col">
      <p className="text-4xl text-white font-sans">
        ${(revenue_total - expense_total).toLocaleString()}
      </p>
      <div className="flex flex-row gap-x-5">
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Inc:</p>
          <p className="text-green-500">${revenue_total.toLocaleString()}</p>
        </div>
        <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
          <p className="text-gray-500">Exp:</p>
          <p className="text-red-500">${expense_total.toLocaleString()}</p>
        </div>
      </div>

      <div className="h-96">
        <BarChart width={500} height={300} data={data?.get_user_transactions}>
          <Bar barSize={15} dataKey="amount" fill="#ffffff" />
          <YAxis dataKey="amount" />
          <XAxis dataKey="note" />
          <Legend />
        </BarChart>
        {/* <ResponsiveContainer width="100%" height="100%">
        </ResponsiveContainer> */}
      </div>

      <div
        name="transactions"
        className="flex flex-wrap gap-10 justify-center mt-5"
      >
        {data?.get_user_transactions?.map((e, index) => (
          <TransactionCard
            {...e}
            key={`transaction-card-${index}`}
            className="flex-1"
          />
        ))}
      </div>
    </div>
  );
}
