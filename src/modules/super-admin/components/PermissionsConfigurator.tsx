"use client";

import React from "react";

interface PermissionsConfiguratorProps {
  permissions: Record<string, string[]>;
  onChange: (permissions: Record<string, string[]>) => void;
}

const MODULES = [
  { id: "dashboard", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "properties", label: "Properties" },
  { id: "team", label: "Team Management" },
  { id: "gallery", label: "Gallery" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog", label: "Blog Management" },
  { id: "inquiry", label: "Inquiries & Leads" },
  { id: "forms", label: "Form Builder" },
  { id: "popup", label: "Popup Campaigns" },
  { id: "themes", label: "Themes" },
];

const ACTIONS = [
  { id: "view", label: "View" },
  { id: "create", label: "Create" },
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

export default function PermissionsConfigurator({
  permissions,
  onChange,
}: PermissionsConfiguratorProps) {
  const handleToggle = (moduleId: string, actionId: string) => {
    const currentActions = permissions[moduleId] || [];
    let nextActions: string[];

    if (currentActions.includes(actionId)) {
      nextActions = currentActions.filter((a) => a !== actionId);
    } else {
      nextActions = [...currentActions, actionId];
    }

    const nextPermissions = { ...permissions };
    if (nextActions.length === 0) {
      delete nextPermissions[moduleId];
    } else {
      nextPermissions[moduleId] = nextActions;
    }

    onChange(nextPermissions);
  };

  const handleToggleRow = (moduleId: string) => {
    const currentActions = permissions[moduleId] || [];
    const allActions = ACTIONS.map((a) => a.id);
    const nextPermissions = { ...permissions };

    if (currentActions.length === allActions.length) {
      // Toggle off all
      delete nextPermissions[moduleId];
    } else {
      // Toggle on all
      nextPermissions[moduleId] = allActions;
    }

    onChange(nextPermissions);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-[#1e1e2e] pb-3">
        <h3 className="text-sm font-semibold text-slate-200">Module Access Permissions</h3>
        <span className="text-xs text-slate-500">Assign view, create, edit and delete capabilities</span>
      </div>

      <div className="overflow-hidden border border-[#1e1e2e] rounded-xl">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-[#1a1a24] border-b border-[#1e1e2e]">
              <th className="p-3 text-xs font-semibold uppercase text-slate-400">Module</th>
              {ACTIONS.map((action) => (
                <th key={action.id} className="p-3 text-center text-xs font-semibold uppercase text-slate-400">
                  {action.label}
                </th>
              ))}
              <th className="p-3 text-center text-xs font-semibold uppercase text-slate-400">Toggle All</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e2e]/50">
            {MODULES.map((mod) => {
              const currentActions = permissions[mod.id] || [];
              const isAllChecked = ACTIONS.every((a) => currentActions.includes(a.id));

              return (
                <tr key={mod.id} className="hover:bg-[#1a1a24]/30 transition-colors">
                  <td className="p-3 text-sm font-medium text-slate-300">{mod.label}</td>
                  {ACTIONS.map((action) => {
                    const isChecked = currentActions.includes(action.id);
                    return (
                      <td key={action.id} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggle(mod.id, action.id)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-500"
                        />
                      </td>
                    );
                  })}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleRow(mod.id)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300 cursor-pointer bg-transparent border-none"
                    >
                      {isAllChecked ? "None" : "All"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
