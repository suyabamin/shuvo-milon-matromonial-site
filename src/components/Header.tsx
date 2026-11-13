"use client";

import React, { useState } from "react";
import Link from "next/link";
import { t } from "@/lib/strings";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const nav = t("nav");
  const app = t("app");

  const navLinks = [
    { label: nav.home, href: "/" },
    { label: nav.biodatas, href: "/biodatas" },
    { label: nav.about, href: "/about" },
    { label: nav.faq, href: "/faq" },
    { label: nav.guide, href: "/guide" },
    { label: nav.contact, href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-sm border-b border-input-border shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-button bg-primary flex items-center justify-center text-surface font-heading font-bold text-xl shadow-xs">
              শ
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-xl md:text-2xl text-primary tracking-tight">
                {app.name}
              </span>
              <span className="text-[11px] text-text-muted hidden sm:block -mt-1">
                {app.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-text hover:text-primary transition-colors text-base"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Button (Desktop) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-button text-sm font-medium text-primary border border-primary/20 hover:bg-bg-soft transition-colors h-11"
            >
              {nav.login}
            </Link>
            <Link
              href="/create"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-button text-sm font-semibold text-surface bg-primary hover:bg-primary/90 shadow-xs transition-colors h-11"
            >
              {nav.createBiodata}
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-button text-sm font-medium text-primary border border-primary/20 h-9"
            >
              {nav.login}
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-button text-text hover:text-primary hover:bg-bg-soft focus:outline-hidden"
              aria-label={mobileMenuOpen ? nav.closeMenu : nav.menu}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-input-border bg-surface px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-button text-base font-medium text-text hover:bg-bg-soft hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-input-border mt-3">
            <Link
              href="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 rounded-button font-semibold text-surface bg-primary hover:bg-primary/90 text-center shadow-xs"
            >
              {nav.createBiodata}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
