"use server";

import { redirect } from "next/navigation";
import { auth } from "../auth";
import { headers } from "next/headers";

async function uploadImageToCloudinary(image: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", image);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Image upload failed");
  }

  const data = await response.json();
  return data.url; // Returns the Cloudinary URL
}

// Sign up with optional image
export const signUp = async (
  email: string,
  password: string,
  name: string,
  image?: File,
  role: "user" | "admin" = "user"
) => {
  let imageUrl = "";

  // If user provided an image, upload it first
  console.log(image, name)
  if (image) {
    try {
      imageUrl = await uploadImageToCloudinary(image);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  }

  const result = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name,
      image: imageUrl,
      role
    },
  });

  return result;
};

export const signIn = async (email: string, password: string) => {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });
  return result;
};

export const signInWithProviders = async (provider: "github" | "google") => {
  const {url} = await auth.api.signInSocial({
    body: {
      provider,
    },
  });
  if (url) {
    redirect(url);
  }
};

export const signOut = async () => {
  const result = await auth.api.signOut({ headers: await headers() });
  return result;
};

// Optional: Update user profile image
// export const updateProfileImage = async (imageFile: File) => {
//   try {
//     const imageUrl = await uploadImageToCloudinary(imageFile);

//     // Update user profile with new image
//     const result = await auth.api.updateUser({
//       body: {
//         image: imageUrl,
//       },
//       headers: await headers(),
//     });

//     return result;
//   } catch (error) {
//     console.error("Profile image update failed:", error);
//     throw error;
//   }
// };