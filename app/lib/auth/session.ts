import jwt from "jsonwebtoken";

export function getSession(token: string | undefined) {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };
    return decoded;
  } catch (error) {
    return null;
  }
}
