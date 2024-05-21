"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import { signOut } from "@/database/auth/auth.actions";

type TProps = {
  userId: string;
  activityCount: number;
};

const LeftSideBar = ({ userId, activityCount }: TProps) => {
  const pathname = usePathname();

  const logout = async () => {
    await signOut();
  };

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flex w-full flex-1 gap-6 flex-col px-6">
        {sidebarLinks.map((link) => {
          const isActive =
            ((pathname.includes(link.route) ||
              pathname.includes(link.label.toLowerCase())) &&
              link.route.length > 1) ||
            pathname === link.route;

          const isActivityIcon = link.route === "/activity";

          if (link.route === "/profile") link.route = `/profile/${userId}`;
          return (
            <div key={link.label}>
              <Link
                href={link.route}
                className={`leftsidebar_link ${
                  isActive && "bg-primary-500"
                } relative`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                {isActivityIcon && activityCount > 0 && (
                  <span className="size-6 flex justify-center items-center text-[12px] rounded-full bg-red-500 text-light-1 absolute left-8 top-0">
                    {activityCount > 99 ? "99+" : activityCount}
                  </span>
                )}
                <p className="text-light-1 max-lg:hidden">{link.label}</p>
              </Link>
            </div>
          );
        })}
      </div>
      <div className="mt-10 px-6">
        <div className="flex cursor-pointer gap-4 p-4" onClick={logout}>
          <Image
            src={"/assets/logout.svg"}
            width={24}
            height={24}
            alt="logout"
          />
          <p className="text-light-1 max-lg:hidden">Logout</p>
        </div>
      </div>
    </section>
  );
};

export default LeftSideBar;
