import React,{useEffect,useState} from "react";

export default function TransactionForm({id="",method}) {

    useEffect(()=>{

        
    },[])
    return (
        <div>
            TransactionForm
        </div>
    );
};

export const getServerSideProps = async (req, res) => {
    const {
      query: [method, id],
    } = req.query;
  
    return { props: { method, id: id ?? "" } };
  };
