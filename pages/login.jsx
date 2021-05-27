import React from "react";
import Header from "@components/Header";
import { getProviders, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import Image from "next/image";

export const logos = {
  Google: "/Google.svg",
  GitHub: "/GitHub.svg"
}

const Login = ({ providers }) => {
  const router = useRouter();

  const [session, loading] = useSession();

  if (session) router.push("/");
  if (loading) return <Loading />;
  return (
    <div className="bg-gray-900 min-h-screen flex justify-center items-center flex-col">
      <Header title="Login" />
      <>
        {Object.values(providers).map((provider) =>

        (
          <div key={provider.name} className="box-border h-16 w-64 border-4 text-right bg-gray-800 grid grid-cols-3 flex space-x-0">
            <div className="flex items-left pl-5 w-16">
              <Image
                width={25}
                height={25}
                src={logos[provider.name]}
              />
            </div>

            <button className="text-white w-auto col-span-2" onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </>
    </div>
  );
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default Login;
