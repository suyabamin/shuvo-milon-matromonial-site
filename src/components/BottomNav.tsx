"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { t } from "@/lib/strings";

export function BottomNav() {
  const pathname = usePathname();
  const tabs = t("tabs");

  const navItems = [
    {
      label: tabs.home,
      href: "/",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? "text-primary" : "text-text-muted"}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: tabs.search,
      href: "/biodatas",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? "text-primary" : "text-text-muted"}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      ),
    },
    {
      label: tabs.interest,
      href: "/interests",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? "text-primary" : "text-text-muted"}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      label: tabs.chat,
      href: "/chat",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? "text-primary" : "text-text-muted"}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      label: tabs.profile,
      href: "/me",
      icon: (active: boolean) => (
        <svg
          className={`w-6 h-6 ${active ? "text-primary" : "text-text-muted"}`}
          fill={active ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-input-border md:hidden safe-area-bottom shadow-lg">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center relative py-1 text-xs"
            >
              <div className="relative">
                {item.icon(isActive)}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent" />
                )}
              </div>
              <span
                className={`mt-1 font-medium transition-colors ${
                  isActive ? "text-primary font-bold" : "text-text-muted"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
