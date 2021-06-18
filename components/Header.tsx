import React from "react";
import Head from "next/head";

const Header = ({ title }: { title: string }) => {
  return (
    <Head>
      <title>{`${title} | Money Tracker PWA`}</title>
    </Head>
  );
};

export default Header;
