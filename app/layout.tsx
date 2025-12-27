import { Schibsted_Grotesk, Martian_Mono } from "next/font/google";
import "./globals.css";
import LightRays from "../components/LightRays";
import NavBar from "../components/NavBar";
import { PosthogProvider } from "./providers/PosthogProvider";
import { Suspense } from "react";
import { auth } from "./lib/auth";
import { headers } from "next/headers";
import { Toaster } from "sonner";
import Footer from "../components/Footer";

async function NavBarWithSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  console.log("Server session:", session); // Debug log
  return <NavBar session={session} />;
}

const schibstedGrotesk = Schibsted_Grotesk({
  variable: "--font-schibsted-grotesk",
  subsets: ["latin"],
});

const martianMono = Martian_Mono({
  variable: "--font-martian-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EventHub",
  description: "The EventHub - Where You Won't Miss Any Event",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${schibstedGrotesk?.variable} ${martianMono?.variable} min-h-screen antialiased`}
      >
        <Toaster richColors position="bottom-right" />
        <PosthogProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <NavBarWithSession />
          </Suspense>
          <div className="z-[-1] absolute min-h-screen inset-0 top-0">
            <LightRays
              raysOrigin="top-center-offset"
              raysColor="#5dfeca"
              raysSpeed={1.2}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
            />
          </div>
          <main>{children}</main>
          <Footer />
        </PosthogProvider>
      </body>
    </html>
  );
}
