"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { User, Settings, LogOut } from "lucide-react";
import { signOut } from "../app/lib/actions/auth-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type User = {
  id: string;
  name: string | null;
  email?: string;
  image?: string | null;
  [key: string]: any;
};

export default function ProfileDropdown({ user }: { user: User }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    const result = await signOut();
    if (!result?.success) {
      toast.error("Failed to logout");
    } else {
      router.push("/login");
    }
  };

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : (user.email?.[0] || "U").toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-dark-100/60 px-2 py-1 transition-all duration-200 hover:bg-dark-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-100 active:scale-[0.98]"
        aria-label="Profile menu"
      >
        {user.image ? (
          <Image
            src={user.image}
            alt={user.name || "User"}
            width={32}
            height={32}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black font-semibold text-sm">
            {userInitials}
          </div>
        )}
        <span className="max-sm:hidden">
          {user.name || user.email || "User"}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md bg-dark-100 border border-dark-200 shadow-lg z-50">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-dark-200">
              <p className="text-sm font-semibold text-white">
                {user.name || "User"}
              </p>
              {user.email && (
                <p className="text-xs text-light-200 truncate">{user.email}</p>
              )}
            </div>
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-light-100 hover:bg-dark-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </span>
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-light-100 hover:bg-dark-200 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
