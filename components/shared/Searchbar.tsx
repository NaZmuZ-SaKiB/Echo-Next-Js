"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Input } from "../ui/input";

interface Props {
  routeType: "search" | "communities";
}

const Searchbar = ({ routeType }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);

    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // setTimeout(() => {
    router.replace(`${pathname}?${params.toString()}`);
    // }, 500);
  };

  return (
    <div className="searchbar">
      <Image
        src="/assets/search-gray.svg"
        alt="search"
        width={24}
        height={24}
        className="object-contain"
      />

      <Input
        id="text"
        onChange={(e) => handleSearch(e.target.value)}
        placeholder={`${
          routeType !== "search" ? "Search communities" : "Search creators"
        }`}
        className="no-focus searchbar_input"
        defaultValue={searchParams.get("q")?.toString()}
      />
    </div>
  );
};

export default Searchbar;
