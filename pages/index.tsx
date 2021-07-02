import _ from "lodash";
import React, { useState, useEffect } from "react";
import Loading from "@components/Loading";
import TransactionCard from "@components/TransactionCard";
import Options from "@components/Home/Options";

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
import { cardIncrement, defaultMaxWeeks } from "@config/home";

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


const getTotal = (data: Transaction[], key: string) => {
  if (!data) return 0;

  return data.filter((e: any) => e?.type?.toLowerCase() === key)
    .map((e: any) => e.amount)
    .reduce((a: number, b: number) => a + b, 0);
}

export default function Home() {
  const [session, loading] = useSession();
  const router = useRouter();
  const [optionsState, setOptionsState] = useState({
    compact: false,
    timePeriod: "month",
    start: null,
    end: null,
    chartMaxWeeks: defaultMaxWeeks
  });

  const { data, loading: dataLoading } = useQuery(GET_TRANSACTIONS, {
    variables: { id: session?.user?.id, start: optionsState?.start, end: optionsState?.end },
    pollInterval: 1000
  });

  useEffect(() => {
    const today = new Date();

    if (optionsState.timePeriod === "month") {
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

      setOptionsState({ ...optionsState, start: monthStart, end: monthEnd })
    } else if (optionsState.timePeriod === "year") {
      const yearStart = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
      const yearEnd = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

      setOptionsState({ ...optionsState, start: yearStart, end: yearEnd })
    } else if (optionsState.timePeriod === "all time") {
      setOptionsState({ ...optionsState, start: null, end: null })
    } else if (optionsState.timePeriod === "day") {
      setOptionsState({ ...optionsState, start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0), end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999) })
    }
  }, [optionsState.timePeriod])


  const [open, setOpen] = useState(false);
  const [cardSlice, setCardSlice] = useState(cardIncrement);

  if (!loading && !session) {
    router.push("/login");
    return <Loading />;
  };

  if (loading || dataLoading || !session) return <Loading />;

  return (
    <div className="bg-gray-900 flex flex-1 items-center min-h-screen flex-col p-1 pb-20 sm:pb-0 relative" >
      <Header title="Home" />
      <div className="absolute top-2 right-2 cursor-pointer">
        <OptionsIcon onClick={() => setOpen(!open)} className="text-white w-5 h-5 sm:w-7 sm:h-7 hover:text-green-500 transition" />
      </div>
      {open && (
        <Options
          setOpen={setOpen}
          state={optionsState}
          setState={setOptionsState}
        />
      )}
      <div className="mt-2">
        <div className="flex flex-col items-center gap-3">
          <p className="text-2xl text-white">
            ${(getTotal(data.get_transactions_between, "revenue") - getTotal(data.get_transactions_between, "expense")).toLocaleString()}
          </p>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Inc:</p>
              <p className="text-green-500">
                ${getTotal(data.get_transactions_between, "revenue")?.toLocaleString()}
              </p>
            </div>
            <div className="flex flex-row gap-x-2 rounded-full py-1 px-3 bg-gray-800">
              <p className="text-gray-500">Exp:</p>
              <p className="text-red-500">
                ${getTotal(data.get_transactions_between, "expense")?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {data?.get_transactions_between.length > 0 &&
          <div>
            <div className="block md:hidden mt-2">
              <Chart
                width={window.innerWidth - 20}
                height={400}
                data={getChartData(data?.get_transactions_between).slice(-1 * optionsState.chartMaxWeeks)}
              />
            </div>
            <div className="hidden md:block">
              <Chart
                width={700}
                height={500}
                data={getChartData(data?.get_transactions_between).slice(-1 * optionsState.chartMaxWeeks)}
              />
            </div>
          </div>}
      </div>

      <div
        className={`mx-1 gap-2 grid grid-flow-row w-full sm:mx-auto sm:w-2/3 max-w-5xl sm:gap-3 ${optionsState.compact ? "grid-cols-3 sm:grid-cols-5" : "lg:grid-cols-2 xl:grid-cols-3"
          } mt-5`}
      >
        {
          data?.get_transactions_between
            .slice(0, cardSlice)
            .map((e: any, index: number) =>
              optionsState.compact ? (
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
      {cardSlice < data.get_transactions_between.length && <div className="flex justify-center">
        <div
          className="bg-gray-800 p-2 rounded-md my-3 hover:bg-gray-700 transition cursor-pointer flex items-center text-white text-2xl"
          onClick={() =>
            setCardSlice(cardSlice + cardIncrement)}
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
  }));

  return groupedByType;
}
