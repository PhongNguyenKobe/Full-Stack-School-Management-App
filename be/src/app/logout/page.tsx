"use client";

import { useClerk } from "@clerk/nextjs";
import { useEffect } from "react";

export default function LogoutPage() {
  const { signOut } = useClerk();

  useEffect(() => {
    signOut({ redirectUrl: "/" });
  }, [signOut]);

  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-700 mb-2">Logging out</h2>
        <p className="text-gray-500">Please wait while we log you out...</p>
      </div>
    </div>
  );
}
