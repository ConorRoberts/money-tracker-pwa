import React from "react";
import Header from "@components/Header";
import { getProviders, signIn } from "next-auth/client";
import { useRouter } from "next/router";
import Loading from "@components/Loading";
import {useSession} from "next-auth/client";

const Login = ({ providers }) => {
  const router = useRouter();

  const [session, loading] = useSession();

  if (session) router.push("/");
  if (loading) return <Loading />;
  return (
    <div>
      <Header title="Login" />
      <>
        {Object.values(providers).map((provider) => (
          <div key={provider.name}>
            <button onClick={() => signIn(provider.id)}>
              Sign in with {provider.name}
            </button>
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
