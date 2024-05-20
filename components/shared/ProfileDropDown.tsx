"use client";

import { TCommunity } from "@/database/community/community.interface";
import { TUser } from "@/database/user/user.interface";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "@/database/auth/auth.actions";

type TProps = { JsonUser: string | null; JsonCommunities: string };

const ProfileDropDown = ({ JsonUser, JsonCommunities }: TProps) => {
  if (!JsonUser) return null;
  const user = JSON.parse(JsonUser) as TUser;
  const communities = JSON.parse(JsonCommunities) as TCommunity[];

  const logout = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-3 bg-dark-4 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800">
          <div className="size-8 max-sm:size-10 relative">
            <Image
              src={user.image || ""}
              alt="logo"
              fill
              className="rounded-full object-cover"
            />
          </div>
          <h4 className="text-base-semibold text-light-1">{user.name}</h4>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-72 bg-dark-4 border-gray-1 max-h-80 overflow-y-auto">
        {communities.map((community) => (
          <Link href={`/communities/${community._id}`} key={`${community._id}`}>
            <div className="flex items-center gap-3 bg-dark-4 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800">
              <div className="size-8 max-sm:size-10 relative">
                <Image
                  src={community.image || ""}
                  alt="logo"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <h4 className="text-base-regular text-light-1">
                {community.name}
              </h4>
            </div>
          </Link>
        ))}

        <Link href={`/communities/create`}>
          <div className="flex items-center gap-3 bg-dark-4 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800">
            <div className="size-8 max-sm:size-10 relative bg-gray-800 rounded-full text-light-1 flex items-center justify-center text-[1.5rem]">
              +
            </div>
            <h4 className="text-base-regular text-light-1">Create Community</h4>
          </div>
        </Link>

        <div
          className="flex items-center gap-3 bg-dark-4 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-800"
          onClick={logout}
        >
          <div className="size-8 max-sm:size-10 relative text-light-1 flex items-center justify-center">
            <Image
              src={"/assets/logout.svg"}
              width={24}
              height={24}
              alt="logout"
            />
          </div>
          <h4 className="text-base-regular text-light-1">Logout</h4>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropDown;
