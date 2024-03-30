"use server";

import { utApi } from "../UTApi";

export const deleteImage = async (imgUrl: string) => {
  try {
    const urlArray = imgUrl.split("/");
    const key = urlArray[urlArray.length - 1];

    await utApi.deleteFiles(key);

    return { success: true };
  } catch (error) {
    return { success: false };
  }
};
