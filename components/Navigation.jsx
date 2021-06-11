import Link from "next/link";
import { useSession } from "next-auth/client";
import { ROUTES, LOGGED_IN_LINKS, LOGGED_OUT_LINKS } from "@utils/routes";

const link_style =
  "cursor-pointer py-3 px-7 rounded-sm hover:bg-green-700 hover:text-gray-100 transition duration-200 block text-white font-medium text-lg";

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
              <a className={link_style}>{text}</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
export const BottomNavigation = () => {
  const [session, _] = useSession();

  return (
    <div className="bg-gray-800 fixed bottom-0 w-full sm:hidden px-10">
      <ul className="flex list-none gap-8 justify-center pb-6">
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
  );
};
