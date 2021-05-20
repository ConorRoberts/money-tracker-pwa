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

  console.log(data);

  if (isLoading) return <Loading />;

  return (
    <div className="bg-indigo-300 flex justify-center items-center h-screen">
      <p className="text-3xl font-bold">App</p>

      {user && (
        <div>
          Hello User
          <p>In the past {timePeriod}, you spend $100</p>
        </div>
      )}
      <Button>
        <Link href="/api/auth/login">Login</Link>
      </Button>
    </div>
  );
}
