"use client";

import Image from "next/image";
import Link from "next/link";

import ProfileDropDown from "../shared/ProfileDropDown";

type TProps = { JsonUser: string | null; JsonCommunities: string };

const TopBar = ({ JsonUser, JsonCommunities }: TProps) => {
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/assets/logo.webp"} alt="logo" width={30} height={30} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Echo</p>
      </Link>
      <div className="flex items-center gap-1">
        <ProfileDropDown
          JsonUser={JsonUser}
          JsonCommunities={JsonCommunities}
        />
      </div>
    </nav>
  );
};

export default TopBar;
