import React from "react";
import Link from "next/link";
import { t, formatString } from "@/lib/strings";

export function Footer() {
  const footer = t("footer");
  const app = t("app");
  const nav = t("nav");
  // Use fixed base copyright year for static prerender determinism
  const currentYear = "2026";

  return (
    <footer className="bg-surface border-t border-input-border text-text mt-auto pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-button bg-primary flex items-center justify-center text-surface font-heading font-bold text-lg">
                শ
              </div>
              <span className="font-heading font-bold text-xl text-primary">
                {app.name}
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              {footer.aboutText}
            </p>
            <div className="pt-2 text-xs text-text-muted space-y-1">
              <div>ইমেইল: {footer.contactEmail}</div>
              <div>হটলাইন: {footer.contactPhone}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-semibold text-text text-base mb-4">
              {footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-text-muted hover:text-primary transition-colors">
                  {nav.home}
                </Link>
              </li>
              <li>
                <Link href="/biodatas" className="text-text-muted hover:text-primary transition-colors">
                  {nav.biodatas}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-text-muted hover:text-primary transition-colors">
                  {nav.about}
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-text-muted hover:text-primary transition-colors">
                  {nav.faq}
                </Link>
              </li>
              <li>
                <Link href="/guide" className="text-text-muted hover:text-primary transition-colors">
                  {nav.guide}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services & Actions */}
          <div>
            <h3 className="font-heading font-semibold text-text text-base mb-4">
              {footer.services}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/create" className="text-text-muted hover:text-primary transition-colors">
                  {nav.createBiodata}
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-text-muted hover:text-primary transition-colors">
                  {nav.login}
                </Link>
              </li>
              <li>
                <Link href="/me/cv" className="text-text-muted hover:text-primary transition-colors">
                  {nav.myCv}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-muted hover:text-primary transition-colors">
                  {nav.contact}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="font-heading font-semibold text-text text-base mb-4">
              {footer.legal}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-text-muted hover:text-primary transition-colors">
                  {footer.privacy}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-muted hover:text-primary transition-colors">
                  {footer.terms}
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-text-muted hover:text-primary transition-colors">
                  {footer.refund}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-input-border text-center text-xs text-text-muted">
          <p>{formatString(footer.copyright, { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
}
