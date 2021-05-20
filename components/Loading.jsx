import React from "react";
import Image from "next/image";

const Loading = () => {
    return (
        <div className="flex-1 flex justify-center items-center mt-10">
            <Image priority width={100} height={100} src="/Loading.svg" className="animate-spin"/>
        </div>
    );
};

export default Loading;