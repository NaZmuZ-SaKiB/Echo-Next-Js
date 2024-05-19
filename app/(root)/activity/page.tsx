import { redirect } from "next/navigation";

import { currentUser } from "@/database/auth/auth.actions";
import { getMyNotifications } from "@/database/notification/notification.actions";
import { TNotificationPopulated } from "@/database/notification/notification.interface";
import { notificationTypeEnum } from "@/constants";
import InvitationNotificationCard from "@/components/cards/InvitationNotificationCard";

const ActivityPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const activities = (await getMyNotifications(
    `${user._id}`
  )) as any as TNotificationPopulated[];

  return (
    <section>
      <h1 className="head-text mb-10  max-sm:mb-4">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities && activities?.length > 0 ? (
          activities.map((activity) => (
            <>
              {activity.type == notificationTypeEnum.INVITED && (
                <InvitationNotificationCard
                  activityId={`${activity._id}`}
                  image={activity.communityId?.image}
                  link={activity.link}
                  communityName={activity?.communityId?.name}
                  read={activity.read}
                  accepted={activity.accepted || false}
                />
              )}
            </>
          ))
        ) : (
          <p className="!text-base-regular text-light-3">No acivity yet</p>
        )}
      </section>
    </section>
  );
};

export default ActivityPage;
