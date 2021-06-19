import React, { useEffect, useState } from 'react'
import TransactionCard from '@components/TransactionCard';
import Transaction from "@typedefs/transaction";
import Loading from '@components/Loading';
import { Input, Label, Select } from '@components/FormComponents';
import { gql, useQuery } from '@apollo/client';
import { useSession } from 'next-auth/client';
import dateConvert from '@utils/dateConvert';
import { AiOutlinePlus as PlusIcon } from "react-icons/ai";
import capitalize from '@utils/capitalize';

const GET_TRANSACTIONS = gql`
    query getTransactionsBetween($id:String,$start:String,$end:String){
        get_transactions_between(id:$id,start:$start,end:$end){
            id
            note
            category
            amount
            created_at
            taxable
            type
            subcategory
        }
    }
`;

export default function Search() {

    const [session, loading] = useSession();

    const [start, setStart] = useState(null);
    const [end, setEnd] = useState(null);
    const [mode, setMode] = useState("between")
    const [filterText, setFilterText] = useState("")
    const [filterProperty, setFilterProperty] = useState("")
    const [sliceStart, setSliceStart] = useState(0);
    const [sliceEnd, setSliceEnd] = useState(25);
    const [transactions, setTransactions] = useState([]);

    const { data } = useQuery(GET_TRANSACTIONS, { variables: { id: session?.user?.id, start: start?.toISOString(), end: end?.toISOString() } })

    useEffect(() => {
        if (mode === "before") {
            setStart(null);
        } else if (mode === "after") {
            setEnd(null);
        }
    }, [mode]);

    useEffect(() => {
        let t = [];

        if (mode === "between" && (!start || !end)) return;

        if (filterProperty !== "") {
            t = data?.get_transactions_between?.filter(e => e[filterProperty.toLowerCase()]?.toLowerCase().includes(filterText.toLowerCase()));
        } else {
            t = data?.get_transactions_between;
        }

        setTransactions(t);
    }, [data, filterText, filterProperty]);

    if (!session || loading) return <Loading />

    return (
        <div className="flex-1 bg-gray-900 p-2">
            <h1 className="text-gray-100 text-4xl font-semibold my-3 text-center">Search</h1>
            <div className="mx-auto w-full max-w-screen-sm">
                <Select onChange={(e: any) => setMode(e.target.value)}>
                    <option value="between">Between Dates</option>
                    <option value="after">After Date</option>
                    <option value="before">Before Date</option>
                </Select>

                {mode !== "before" && <div>
                    <Label>Start Date</Label>
                    <Input type="date" onChange={(e: any) => setStart(dateConvert(e.target.value))} />
                </div>}
                {mode !== "after" && <div>
                    <Label>End Date</Label>
                    <Input type="date" onChange={(e: any) => setEnd(dateConvert(e.target.value))} />
                </div>}

                <Label className="mt-3">Filter</Label>
                <div className="flex flex-col md:flex-row gap-2 bg-gray-800 p-2 rounded-md">
                    <div className="flex-1">
                        <Label>Query</Label>
                        <Input type="text" onChange={e => setFilterText(e.target.value)} value={filterText} />
                    </div>
                    <div>
                        <Label>Property</Label>
                        <Select onChange={(e: any) => setFilterProperty(e.target.value)} value={filterProperty}>
                            <option value="">None</option>
                            {["note", "subcategory", "category", "type"].map((e, index) => <option key={`filterProperty-${index}`} value={e} className="capitalize">{capitalize(e)}</option>)}
                        </Select>
                    </div>
                </div>
            </div>

            <div className="flex justify-center gap-4 text-lg sm:text-xl my-2">
                <div className="rounded-md bg-gray-700 text-green-500 p-3">
                    <p>{`$${transactions?.filter(e => e.type === "revenue").map(e => e.amount).reduce((a, b) => a + b, 0).toLocaleString()}`}</p>
                </div>
                <div className="rounded-md bg-gray-700 text-red-500 p-3">
                    <p>{`$${transactions?.filter(e => e.type === "expense").map(e => e.amount).reduce((a, b) => a + b, 0).toLocaleString()}`}</p>
                </div>
            </div>
            <div className={`flex flex-wrap flex-row gap-2
          } justify-center mt-5 w-full max-w-screen-xl mx-auto`}>
                {transactions?.slice(sliceStart, sliceEnd)?.map((e: Transaction, index: number) => <TransactionCard {...e} key={index} />)}
            </div>
            {sliceEnd < transactions?.length && transactions?.length > 0 && <div className="flex justify-center">
                <PlusIcon
                    className="bg-gray-800 p-3 rounded-md my-3 hover:bg-gray-600 transition cursor-pointer text-white w-12 h-12"
                    onClick={() => setSliceEnd(sliceEnd + 25)}
                />
            </div>}
        </div >
    )
}
