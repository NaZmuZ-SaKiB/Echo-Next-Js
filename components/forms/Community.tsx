"use client";

import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { deleteImage } from "@/lib/actions/uploadthing.action";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { TCommunity } from "@/database/community/community.interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Image from "next/image";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { CommunityValidation } from "@/database/community/community.validation";
import {
  createCommunity,
  updateCommunityInfo,
} from "@/database/community/community.actions";

type TProps = {
  userId: string;
  JsonCommunity?: string | null;
  btnTitle?: string;
};
const Community = ({ userId, JsonCommunity, btnTitle }: TProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const community = JsonCommunity
    ? (JSON.parse(JsonCommunity) as TCommunity)
    : null;

  const { startUpload } = useUploadThing("media");

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommunityValidation),
    defaultValues: {
      image: community?.image || "",
      name: community?.name || "",
      username: community?.username || "",
      bio: community?.bio || "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target?.files?.length) {
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      // When read is completed then the above onload executes
      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof CommunityValidation>) => {
    setError(null);
    try {
      const blob = values.image;
      const hasImageChanged = isBase64Image(blob);

      if (hasImageChanged) {
        // remove the previous image
        if (pathname === "/communities/edit" && community?.image) {
          const result = await deleteImage(community.image);
          if (!result.success) {
            return;
          }
        }
        // upload the new image
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0]?.url) {
          values.image = imgRes[0]?.url;
          console.log(imgRes);
        }
      }

      if (pathname.includes("/communities/edit")) {
        await updateCommunityInfo({
          ...values,
          username: values.username.toLowerCase().split(" ").join("_"),
          communityId: `${community?._id}`,
        });

        router.back();
      } else {
        const result = await createCommunity({
          ...values,
          username: values.username.toLowerCase().split(" ").join("_"),
          createdById: userId,
        });

        router.push(`/communities/${JSON.parse(result)._id}`);
      }
    } catch (error: any) {
      console.log("error", error);

      setError(error?.message || "Something went wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10 max-sm:gap-6"
      >
        {error && (
          <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
        )}
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile photo"
                    width={96}
                    height={96}
                    priority
                    className="rounded-full size-full object-cover max-sm:size-14"
                  />
                ) : (
                  <Image
                    src="/assets/profile.svg"
                    alt="profile photo"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Community Name
              </FormLabel>
              <FormControl>
                <Input className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Community Username
              </FormLabel>
              <FormControl>
                <Input className="account-form_input no-focus" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Community Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
          type="submit"
          disabled={form.formState.isSubmitting}
        >
          {!form.formState.isSubmitting ? btnTitle || "Submit" : "Saving..."}
        </Button>
      </form>
    </Form>
  );
};

export default Community;
