"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import { Button } from "../ui/button";
import { acceptCommunityJoinInvitation } from "@/database/community/community.actions";

type TProps = {
  notificationId: string;
};

const CommunityInvitationAcceptButton = ({ notificationId }: TProps) => {
  const pathName = usePathname();

  const [acceptLoading, setAcceptLoading] = useState(false);

  const handleAccept = async () => {
    setAcceptLoading(true);

    try {
      await acceptCommunityJoinInvitation(notificationId, pathName);
    } catch (error: any) {
      console.log(error?.message);
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <div>
      <Button
        className="user-card_btn mr-3 disabled:bg-gray-500"
        onClick={handleAccept}
        disabled={acceptLoading}
      >
        {acceptLoading ? "Accepting..." : "Accept Invitation"}
      </Button>
    </div>
  );
};

export default CommunityInvitationAcceptButton;
