"use client";

import { useState } from "react";
import AuthForm from "@/components/AuthForm";

export default function StudentPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  const tab = (m: "login" | "register", label: string) => (
    <button
      type="button"
      onClick={() => setMode(m)}
      className={`min-h-11 flex-1 rounded-full font-extrabold ${
        mode === m ? "bg-navy text-cream" : "bg-butter text-ink hover:bg-gold"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      <div className="mx-auto flex max-w-md gap-2 px-5 pt-10">
        {tab("login", "Log in")}
        {tab("register", "Sign up")}
      </div>
      <AuthForm key={mode} mode={mode} role="student" showSwitch={false} />
    </div>
  );
}