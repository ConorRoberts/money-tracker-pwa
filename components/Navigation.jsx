import Link from "next/link";
import { useUser } from "@auth0/nextjs-auth0";
import Image from "next/image";

export default function Navigation() {
  const { user } = useUser();

  const ROUTES = [
    {
      path: "/",
      text: "Home",
      icon: "/Home.svg",
    },
    {
      path: "/form",
      text: "Form",
      icon: "/Plus.svg",
    },
  ];

  const LOGGED_OUT_ROUTES = [
    {
      path: "/api/auth/login",
      text: "Login",
      icon: "/Person.svg",
    },
  ];
  const LOGGED_IN_ROUTES = [
    {
      path: "/api/auth/logout",
      text: "Logout",
      icon: "/Person.svg",
    },
  ];

  return (
    <div className="bg-gray-800 text-white font-thin text-lg flex justify-center sm:justify-end px-10 items-start sm:items-center fixed bottom-0 w-full pb-6 sm:pb-0 sm:static">
      <ul className="flex list-none gap-10 sm:gap-0">
        {[
          ...ROUTES,
          ...(() => (user ? LOGGED_IN_ROUTES : LOGGED_OUT_ROUTES))(),
        ].map(({ path, text, icon }, index) => (
          <li key={`nav-bar-route-${index}`} className="block">
            <Link href={path}>
              <a className="cursor-pointer p-3 rounded-md hover:bg-gray-900 transition-all hidden sm:block">
                {text}
              </a>
            </Link>
            <Link href={path}>
              <a className="cursor-pointer p-3 rounded-md hover:bg-gray-900 transition-all sm:hidden flex justify-center">
                <Image priority width={30} height={30} src={icon} />
              </a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
