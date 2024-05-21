"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import {
  acceptCommunityJoinRequest,
  rejectCommunityJoinRequest,
} from "@/database/community/community.actions";

type TProps = {
  requestId: string;
};

const CommunityRequestAcceptButton = ({ requestId }: TProps) => {
  const pathName = usePathname();

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const handleAccept = async () => {
    setAcceptLoading(true);

    try {
      await acceptCommunityJoinRequest(requestId, pathName);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);

    try {
      await rejectCommunityJoinRequest(requestId, pathName);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setRejectLoading(false);
    }
  };
  return (
    <div>
      <Button
        className="user-card_btn mr-3 disabled:bg-gray-500"
        onClick={handleAccept}
        disabled={acceptLoading}
      >
        {acceptLoading ? "Accepting..." : "Accept"}
      </Button>
      <Button
        className="text-[12px] text-light-1 disabled:bg-gray-500"
        size="sm"
        variant="destructive"
        onClick={handleReject}
        disabled={rejectLoading}
      >
        {rejectLoading ? "Rejecting..." : "Reject"}
      </Button>
    </div>
  );
};

export default CommunityRequestAcceptButton;
