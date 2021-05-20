import { useUser } from "@auth0/nextjs-auth0";
import { Button, Select } from "@components/FormComponents";
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
  const array = ["stinky", "monkey", "poo", "ape", "gorilla"];

  if (isLoading) return <Loading />;

  return (
    <div className="bg-indigo-300 flex justify-center items-center h-screen">
      <p className="text-3xl font-bold">App</p>

      {user && (
        <div>
          <Select onChange={(e) => setTimePeriod(e.target.value)}>
            {["day", "week", "month", "year"].map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </Select>
          Hello {user?.nickname}
          <p>In the past {timePeriod}, you spend $100</p>
        </div>
      )}
      <Button>
        <Link href="/api/auth/login">Login</Link>
      </Button>
    </div>
  );
}
