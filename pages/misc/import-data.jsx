import { Input, Button } from "@components/FormComponents";
import React, { useEffect, useState } from "react";
import { useMutation, gql } from "@apollo/client";
import axios from "axios";

const UPLOAD_FILE = gql`
  mutation upload($file: Upload) {
    upload(file: $file)
  }
`;

const ImportData = () => {
  const [file, setFile] = useState(null);

  const [upload] = useMutation(UPLOAD_FILE, {
    onCompleted: (data) => console.log(data),
  });
  console.log(file);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    console.log(body);
    body.append("file", file);
    const response = await fetch("/api/upload", {
      method: "POST",
      body,
    });
    // upload({ variables: { file: file } });

    // await axios.post("/api/upload", { data: file });
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <Input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <Button type="submit" className="bg-gray-100">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default ImportData;
