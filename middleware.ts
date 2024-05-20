import { NextRequest, NextResponse } from "next/server";
import { jwtHelpers } from "./utils/jwt";

export const middleware = async (req: NextRequest) => {
  console.log("middleware", req.url);

  const jwt = req.cookies.get("jwt");

  if (!jwt?.value) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    await jwtHelpers.verifyToken(jwt.value, process.env.JWT_SECRET as string);
  } catch (error) {
    console.log(error);
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/search",
    "/create-echo",
    "/communities/:path*",
    "/activity",
    "/change-password",
  ],
};
