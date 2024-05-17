"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import {
  cancelCommunityJoinRequest,
  createCommunityJoinRequest,
} from "@/database/community/community.actions";

type TProps = {
  requested: boolean;
  communityId: string;
  userId: string;
};

const CommunityRequestButton = ({
  requested = false,
  communityId,
  userId,
}: TProps) => {
  const [requestSent, setRequestSent] = useState(requested);

  const handleJoinRequest = async () => {
    try {
      setRequestSent(true);
      await createCommunityJoinRequest(communityId, userId);
    } catch (error: any) {
      console.log(error?.message);
    }
  };

  const handleCancelRequest = async () => {
    try {
      setRequestSent(false);
      await cancelCommunityJoinRequest(communityId, userId);
    } catch (error: any) {
      console.log(error?.message);
    }
  };
  return (
    <>
      <Button
        className={`bg-primary-500 px-5 mr-3 disabled:bg-dark-4`}
        size="sm"
        disabled={requestSent}
        onClick={handleJoinRequest}
      >
        {requestSent ? "Request Sent" : "Join Community"}
      </Button>
      {requestSent && (
        <Button onClick={handleCancelRequest}>Cancel Request</Button>
      )}
    </>
  );
};

export default CommunityRequestButton;
