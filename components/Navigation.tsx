import Link from "next/link";
import { useSession } from "next-auth/client";
import { ROUTES, LOGGED_IN_LINKS, LOGGED_OUT_LINKS } from "@utils/routes";
import { IoMenuOutline as MenuIcon } from "react-icons/io5";
import { IoClose as CloseIcon } from "react-icons/io5";
import { useRef, useState } from "react";
import PopupContainer from "@components/PopupContainer";

const link_style =
  "cursor-pointer py-2 px-4 sm:px-6 rounded-md hover:bg-green-700 hover:text-gray-100 transition duration-200 block text-white font-medium text-lg";

export const TopNavigation = () => {
  const [session, _] = useSession();

  return (
    <div className="bg-gray-800 sm:flex justify-end items-start w-full hidden">
      <ul className="flex list-none">
        {[
          ...ROUTES,
          ...(() => (session ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS))(),
        ].map(({ path, text }, index) => (
          <li key={`nav-bar-route-${index}`} className="block">
            <Link href={path}>
              <a className={link_style}>
                {text}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export const BottomNavigation = () => {
  const [session, _] = useSession();

  const [open, setOpen] = useState(false);
  const ref = useRef();

  return (
    <>
      {open && <PopupContainer setOpen={setOpen} passRef={ref}>
        <div className={`bg-gray-800 shadow-lg h-screen w-52 animate-slide-in-left fixed right-0`} ref={ref}>
          <div className="flex justify-end">
            <CloseIcon className="h-10 w-10 p-2 text-white rounded-md hover:bg-gray-700 transition cursor-pointer" onClick={() => setOpen(false)} />
          </div>
          <ul className="flex flex-col list-none gap-3 justify-between pb-6">
            {[
              ...ROUTES,
              ...(() => (session ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS))(),
            ].map(({ path, text }, index) => (
              <li key={`nav-bar-route-${index}`} className="block">
                <Link href={path}>
                  <a className={link_style}>{text}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </PopupContainer>}
      <div className="bg-gray-800 fixed bottom-0 w-full sm:hidden px-5">
        <ul className="flex list-none gap-8 justify-between pb-6">
          {[
            ...ROUTES,
            ...(() => (session ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS))(),
          ].map(({ path, text }, index) => (
            <li key={`nav-bar-route-${index}`} className="block">
              <Link href={path}>
                <a className={link_style}>{text}</a>
              </Link>
            </li>
          ))}
          <li className={"block" + link_style}>
            <MenuIcon className="h-8 w-8" onClick={() => setOpen(true)} />
          </li>
        </ul>
      </div>
    </>
  );
};
