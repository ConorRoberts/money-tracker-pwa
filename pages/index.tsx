import _ from "lodash";
import React, { useState, useEffect } from "react";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import Options from "@components/Options";

import { useSession } from "next-auth/client";
import Chart from "@components/Home/Chart";
import { useRouter } from "next/router";
import Header from "@components/Header";
import CompactTransactionCard from "@components/CompactTransactionCard";
import type Transaction from "@typedefs/transaction";
import getWeekStart from "@utils/getWeekStart";
import { BsFillGearFill as OptionsIcon } from "react-icons/bs";
import { gql, useQuery } from "@apollo/client";
import { AiOutlinePlus as PlusIcon } from "react-icons/ai";

const GET_TRANSACTIONS = gql`
    query getTransactionsBetween($id:String,$start:String,$end:String){
        get_transactions_between(id:$id,start:$start,end:$end){
            id
            category
            amount
            created_at
            taxable
            type
            description
            subcategory
        }
    }
`;

const CARD_INCREMENT = 15;

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [options_state, setOptionsState] = useState({
    compact: false,
    time_period: "month",
    start: null,
    end: null,
  });

  const { data } = useQuery(GET_TRANSACTIONS, {
    variables: { id: session?.user?.id, start: options_state.start, end: options_state.end },
    pollInterval: 1000
  });

  // console.log(data);

  useEffect(() => {
    const today = new Date();

    if (options_state.time_period === "month") {
      const month_start = new Date(today.getFullYear(), today.getMonth(), 1);
      const month_end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

      setOptionsState({ ...options_state, start: month_start, end: month_end })
    } else if (options_state.time_period === "year") {
      const year_start = new Date(today.getFullYear(), 1, 1);
      const year_end = new Date(today.getFullYear(), 12, 1);

      setOptionsState({ ...options_state, start: year_start, end: year_end })
    } else if (options_state.time_period === "all time") {
      setOptionsState({ ...options_state, start: null, end: null })
    } else if (options_state.time_period === "day") {
      setOptionsState({ ...options_state, start: today, end: today })
    }
  }, [options_state.time_period])


  const [open, setOpen] = useState(false);
  const [card_slice, setCardSlice] = useState(CARD_INCREMENT);

  if (!loading && !session) router.push("/login");
  if (loading || !data || !session) return <Loading />;

  const revenue_total = data?.get_transactions_between
    .filter((e: any) => e?.type?.toLowerCase() === "revenue")
    .map((e: any) => e.amount)
    .reduce((a: number, b: number) => a + b, 0);

  const expense_total = data?.get_transactions_between
    .filter((e: any) => e?.type?.toLowerCase() === "expense")
    .map((e: any) => e.amount)
    .reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="bg-gray-900 flex flex-1 items-center min-h-screen flex-col p-1 pb-20 sm:pb-0 relative" >
      <Header title="Home" />
      <div className="absolute top-2 right-2 cursor-pointer">
        <OptionsIcon onClick={() => setOpen(!open)} className="text-white w-5 h-5 sm:w-7 sm:h-7 hover:text-green-500 transition" />
      </div>
      {open && (
        <Options
          setOpen={setOpen}
          state={options_state}
          setState={setOptionsState}
        />
      )}
      <div className="mt-2">
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl text-white">
            ${(revenue_total - expense_total).toLocaleString()}
          </p>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Inc:</p>
              <p className="text-green-500">
                ${revenue_total?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Exp:</p>
              <p className="text-red-500">
                ${expense_total?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="block md:hidden mt-2">
          <Chart
            width={window.innerWidth - 20}
            height={400}
            data={getChartData(data?.get_transactions_between)}
          />
        </div>
        <div className="hidden md:block">
          <Chart
            width={700}
            height={500}
            data={getChartData(data?.get_transactions_between)}
          />
        </div>
      </div>

      <div
        className={`mx-1 gap-2 grid grid-flow-row w-full sm:mx-auto sm:w-2/3 max-w-3xl sm:gap-3 ${options_state.compact ? "grid-cols-3 sm:grid-cols-5" : "lg:grid-cols-2"
          } mt-5`}
      >
        {
          data?.get_transactions_between
            .slice(0, card_slice)
            .map((e: any, index: number) =>
              options_state.compact ? (
                <CompactTransactionCard
                  {...e}
                  key={`transaction-card-${index}`}
                />
              ) : (
                <TransactionCard
                  {...e}
                  key={`transaction-card-${index}`}
                />
              )
            )
        }
      </div>
      {card_slice < data.get_transactions_between.length && <div className="flex justify-center">
        <div
          className="bg-gray-800 p-2 rounded-md my-3 hover:bg-gray-700 transition cursor-pointer flex items-center text-white text-2xl"
          onClick={() =>
            setCardSlice(card_slice + CARD_INCREMENT)}
        >
          <PlusIcon />
        </div>
      </div>}
    </div >
  );
}

/**
 * Formats a list of transactions so that their data can be used by the charts
 * @param transactions 
 * @returns 
 */
const getChartData = (transactions: Transaction[]): { key: string, revenue: number, expense: number }[] => {

  if (!transactions?.length) return [];

  const getSum = (list: Transaction[], type: string): number => {
    return +list.filter((e: Transaction) => e.type === type).map((e: Transaction) => e.amount).reduce((a: number, b: number) => a + b, 0)
      .toFixed(2)
  }

  const groupedByDate = Object.entries(_.groupBy(transactions.map((e: any) => ({ ...e, created_at: getWeekStart(new Date(e.created_at.slice(0, 10))).toDateString() })), "created_at")).reverse();

  const groupedByType = groupedByDate.map(([key, value]: [key: string, value: Transaction[]]): { key: string, revenue: number, expense: number } => ({
    key: key.split(" ").slice(1, 3).join(" "), revenue: getSum(value, "revenue")
    , expense: getSum(value, "expense"),
  })).slice(-4);

  return groupedByType;
}
