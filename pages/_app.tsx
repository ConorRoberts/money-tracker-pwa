import { Provider } from "next-auth/client";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import { ApolloProvider } from "@apollo/client";
import client from "@lib/apollo-client";
import { TopNavigation } from "@components/Navigation";
import { BottomNavigation } from "@components/Navigation";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
        />
        <meta
          name="description"
          content="This is a progressive web app developed by Conor Roberts and Adrian Alexander. The purpose of this app is to simplify the process of tracking spendings/earnings."
        />
        <meta
          name="keywords"
          content="conor roberts,adrian alexander,money,finance,pwa,app,website"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap"
          rel="stylesheet"></link>
        <title>Money Tracker PWA</title>

        <link rel="manifest" href="/manifest.json" />
        <link
          href="/icons/favicon-16x16.png"
          rel="icon"
          type="image/png"
          sizes="16x16"
        />
        <link
          href="/icons/favicon-32x32.png"
          rel="icon"
          type="image/png"
          sizes="32x32"
        />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png"></link>
        <meta name="theme-color" content="#317EFB" />
      </Head>
      <ApolloProvider client={client}>
        <Provider session={pageProps.session}>
          <div className="flex flex-col min-h-screen ">
            <TopNavigation />
            <Component {...pageProps} />
            <BottomNavigation />
          </div>
        </Provider>
      </ApolloProvider>
    </>
  );
}
