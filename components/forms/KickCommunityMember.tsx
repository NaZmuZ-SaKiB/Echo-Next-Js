"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { kickCommunityMember } from "@/database/community/community.actions";
import { usePathname } from "next/navigation";

type TProps = {
  communityId: string;
  memberId: string;
};

const KickCommunityMember = ({ communityId, memberId }: TProps) => {
  const pathName = usePathname();

  const [loading, setLoading] = useState(false);

  const handleKick = async () => {
    setLoading(true);

    try {
      await kickCommunityMember(communityId, memberId, pathName);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button
      className="text-[12px] text-light-1 disabled:bg-gray-500"
      size="sm"
      variant="destructive"
      disabled={loading}
      onClick={handleKick}
    >
      Kick
    </Button>
  );
};

export default KickCommunityMember;
