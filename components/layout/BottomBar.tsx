"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";

const BottomBar = ({ activityCount }: { activityCount: number }) => {
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map((link) => {
          const isActive =
            (pathname.includes(link.route) && link.route.length > 1) ||
            pathname === link.route;

          const isActivityIcon = link.route === "/activity";
          return (
            <div key={link.label}>
              <Link
                href={link.route}
                className={`bottombar_link ${isActive && "bg-primary-500"}`}
              >
                <Image
                  src={link.imgURL}
                  alt={link.label}
                  width={24}
                  height={24}
                />
                {isActivityIcon && activityCount > 0 && (
                  <span className="size-6 flex justify-center items-center text-[12px] rounded-full bg-red-500 text-light-1 absolute left-9 top-0">
                    {activityCount > 99 ? "99+" : activityCount}
                  </span>
                )}
                <p className="text-light-1 text-subtle-medium max-sm:hidden">
                  {link.label.split(/\s+/)[0]}
                </p>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default BottomBar;
