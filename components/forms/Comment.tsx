"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import { addCommentToThread } from "@/database/thread/thread.actions";
import { CommentValidation } from "@/database/thread/thread.validation";

type TProps = {
  thread_Id: string;
  currentUserImg: string;
  currentUser_Id: string;
};

const Comment = ({ thread_Id, currentUser_Id, currentUserImg }: TProps) => {
  // const router = useRouter();
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),
    defaultValues: {
      thread: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToThread({
      commentText: values.thread,
      userId: currentUser_Id,
      threadId: thread_Id,
      path: pathname,
    });

    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-start gap-3 w-full">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="user"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>
              <FormControl className="border-none bg-transparent">
                <Textarea
                  placeholder="Comment..."
                  className="no-focus text-light-1 outline-none max-h-12 resize-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className={`comment-form_btn disabled:bg-gray-1 disabled:animate-pulse`}
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Replying..." : "Reply"}
        </Button>
      </form>
    </Form>
  );
};

export default Comment;
