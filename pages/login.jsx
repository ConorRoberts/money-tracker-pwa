import React from "react";
import Header from "@components/Header";
import { getProviders, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import { useSession } from "next-auth/client";
import Image from "next/image";

export const logos = {
  Google: "/Google.svg",
  GitHub: "/GitHub.svg",
};

const Login = ({ providers }) => {
  const router = useRouter();

  const [session, loading] = useSession();

  if (session) router.push("/");
  if (loading) return <Loading />;
  return (
    <div className="bg-gray-900 flex-1 flex justify-center items-center flex-col gap-6">
      <Header title="Login" />
      <>
        {Object.values(providers).map((provider) => (
          <div
            key={provider.name}
            className="box-border border rounded-sm bg-gray-800 space-x-0 hover:bg-gray-600 transition-all cursor-pointer text-white font-thin text-lg flex py-4 px-6 justify-between gap-5"
            onClick={() => signIn(provider.id)}
          >
            <Image width={25} height={25} src={logos[provider.name]} />
            <p>Sign in with {provider.name}</p>
          </div>
        ))}
      </>
    </div>
  );
};

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

export default Login;
