import { Input, Button } from "@components/FormComponents";
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/client";
import Loading from "@components/Loading";
import { useRouter } from "next/router";

const ImportData = () => {
  const [file, setFile] = useState(null);
  const [session, loading] = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("file", file);

    const response = await axios.post(`/api/upload/${session.user.id}`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log(response);
  };

  if (loading) return <Loading />;
  if (!loading && !session) {
    router.push("/login");
    return <Loading />;
  }

  return (
    <div className="flex-1 bg-gray-900 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="rounded-md bg-gray-600 p-6 flex flex-col space-y-5 w-full sm:w-auto mx-3 sm:mx-0"
      >
        <Input
          type="file"
          accept=".csv"
          required
          onChange={(e) => setFile(e.target.files[0])}
          className="bg-gray-200"
        />
        <Button type="submit" className="bg-gray-100">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ImportData;
