"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getSessionAction() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      image?: string;
    };

    return decoded;
  } catch {
    return null;
  }
}
