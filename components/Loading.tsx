import React from "react";
import { AiOutlineLoading3Quarters as LoadingIcon } from "react-icons/ai";

const Loading = () => {
    return (
        <div className="flex-1 flex justify-center items-center bg-gray-900">
            <LoadingIcon className="h-24 w-24 animate-spin text-white" />
        </div>
    );
};

export default Loading;