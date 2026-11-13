"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { t } from "@/lib/strings";

interface RouteGuardProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function RouteGuard({ children, requireAdmin = false }: RouteGuardProps) {
  const { user, loading, userMeta } = useAuth();
  const router = useRouter();
  const common = t("common");

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (requireAdmin && userMeta?.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, userMeta, requireAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted">{common.loading}</p>
      </div>
    );
  }

  if (!user || (requireAdmin && userMeta?.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
