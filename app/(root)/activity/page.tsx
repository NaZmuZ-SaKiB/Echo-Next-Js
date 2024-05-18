import { redirect } from "next/navigation";

import Link from "next/link";
import { currentUser } from "@/database/auth/auth.actions";
import { getMyNotifications } from "@/database/notification/notification.actions";
import { TNotificationPopulated } from "@/database/notification/notification.interface";
import { notificationTypeEnum } from "@/constants";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const ActivityPage = async () => {
  const user = await currentUser();
  if (!user) return null;

  if (!user?.onboarded) redirect("/onboarding");

  const activities = (await getMyNotifications(
    `${user._id}`
  )) as any as TNotificationPopulated[];

  console.log("activities", activities);

  return (
    <section>
      <h1 className="head-text mb-10  max-sm:mb-4">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activities && activities?.length > 0 ? (
          activities.map((activity) => (
            <>
              {activity.type == notificationTypeEnum.INVITED && (
                <Link key={`${activity._id}`} href={activity.link}>
                  <article className="activity-card">
                    <Image
                      src={
                        activity?.communityId?.image || "/assets/profile.svg"
                      }
                      alt="user_logo"
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                    />
                    <p className="!text-small-regular text-light-1">
                      You are invited to join the "{activity.communityId?.name}"{" "}
                      community.
                    </p>
                    <Button className="ml-auto bg-primary-500" size="sm">
                      Accept
                    </Button>
                  </article>
                </Link>
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
