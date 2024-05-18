"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { createCommunityInvitationNotification } from "@/database/notification/notification.actions";

type TProps = {
  communityId: string;
  userId: string;
  isInvited: boolean;
};

const CommunityInviteButton = ({ communityId, userId, isInvited }: TProps) => {
  const [invited, setInvited] = useState(isInvited);
  const [loading, setLoading] = useState(false);

  const inviteUser = async () => {
    setLoading(true);
    try {
      await createCommunityInvitationNotification(communityId, userId);
      setInvited(true);
    } catch (error: any) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className="user-card_btn disabled:bg-gray-500"
      disabled={invited || loading}
      onClick={inviteUser}
    >
      {invited ? "Invited" : loading ? "Inviting..." : "Invite"}
    </Button>
  );
};

export default CommunityInviteButton;
