"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "./api";

export type User = { id: string; name: string; email: string; role: "parent" | "student" };

export function useRequireAuth(role?: "parent" | "student") {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api<User>("/auth/me")
      .then((u) => {
        if (role && u.role !== role) {
          router.replace(u.role === "student" ? "/student/dashboard" : "/dashboard");
          return;
        }
        setUser(u);
      })
      .catch(() => router.replace(role === "student" ? "/student" : "/login"));
  }, [router, role]);

  return user;
}