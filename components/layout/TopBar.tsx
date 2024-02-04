"use client";

import {
  OrganizationSwitcher,
  SignOutButton,
  SignedIn,
  useAuth,
} from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();
  return (
    <nav className="topbar">
      <Link href={"/"} className="flex items-center gap-4">
        <Image src={"/assets/logo.svg"} alt="logo" width={28} height={28} />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>
      <div className="flex items-center gap-1">
        {isSignedIn ? (
          <div className="block md:hidden">
            <SignedIn>
              <SignOutButton signOutCallback={() => router.push("/sign-in")}>
                <div className="flex cursor-pointer">
                  <Image
                    src={"/assets/logout.svg"}
                    width={24}
                    height={24}
                    alt="logout"
                  />
                </div>
              </SignOutButton>
            </SignedIn>
          </div>
        ) : (
          <Link href={"/sign-in"} className="block md:hidden text-light-1">
            Login
          </Link>
        )}
        <OrganizationSwitcher
          appearance={{
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
            baseTheme: dark,
          }}
        />
      </div>
    </nav>
  );
};

export default TopBar;
