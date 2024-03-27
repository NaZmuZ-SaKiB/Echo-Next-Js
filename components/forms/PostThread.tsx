"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { ThreadValidation } from "@/database/thread/thread.validation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "../ui/button";
import { createThread } from "@/database/thread/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import { TCommunity } from "@/database/community/community.interface";
import { useState } from "react";

type TProps = { user_Id: string; jsonCommunities: string };

const PostThread = ({ user_Id, jsonCommunities }: TProps) => {
  const communities: TCommunity[] = JSON.parse(jsonCommunities);

  const [error, setError] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      communityId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    setError("");
    try {
      await createThread({
        text: values.thread,
        author: user_Id,
        communityId:
          values.communityId === user_Id ? null : values.communityId || null,
        path: pathname,
      });

      router.push("/");
    } catch (error: any) {
      setError(error?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10  max-sm:mt-4 flex flex-col justify-start gap-10"
      >
        {error && (
          <div className="bg-red-500 text-white p-2 text-sm">{error}</div>
        )}

        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={15}
                  className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="communityId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Post as
              </FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full no-focus border border-dark-4 bg-dark-3 text-light-1">
                    <SelectValue placeholder="Post as (optional)" />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-1 bg-dark-3 text-light-1">
                    <SelectItem
                      className="border border-dark-4 bg-dark-3"
                      value={user_Id}
                    >
                      Yourself
                    </SelectItem>
                    {communities.map((community) => (
                      <SelectItem
                        className="border border-dark-4 bg-dark-3"
                        key={`${community._id}`}
                        value={`${community._id}`}
                      >
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={`bg-primary-500 disabled:bg-gray-1 disabled:animate-pulse`}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting
            ? "Uploading your thoughts..."
            : "Post Echo"}
        </Button>
      </form>
    </Form>
  );
};

export default PostThread;
