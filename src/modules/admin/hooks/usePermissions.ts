"use client";

import { useState, useEffect } from "react";

export function usePermissions() {
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});

  useEffect(() => {
    try {
      const permsStr = localStorage.getItem("admin_permissions");
      if (permsStr) {
        setPermissions(JSON.parse(permsStr));
      }
    } catch (e) {
      console.error("Error reading admin permissions", e);
    }
  }, []);

  const hasPermission = (module: string, action: string): boolean => {
    // If we're on the super-admin section or logged in as super-admin, we check the corresponding key or return true.
    // The regular admin permissions check:
    const allowedActions = permissions[module];
    return allowedActions ? allowedActions.includes(action) : false;
  };

  return { hasPermission, permissions };
}
export default usePermissions;
