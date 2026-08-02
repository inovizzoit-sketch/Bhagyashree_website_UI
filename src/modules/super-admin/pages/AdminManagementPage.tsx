"use client";

import { useEffect, useState } from "react";
import { getAdmins, createAdmin, updateAdmin, deleteAdmin, AdminUser } from "../services/admin.service";
import PermissionsConfigurator from "../components/PermissionsConfigurator";

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [permissions, setPermissions] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAdmins();
  }, []);

  async function loadAdmins() {
    try {
      const data = await getAdmins();
      setAdmins(data);
    } catch (err: any) {
      setError(err.message || "Failed to load admins list.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenCreate() {
    setEditingAdmin(null);
    setUsername("");
    setPassword("");
    setIsActive(true);
    setPermissions({});
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function handleOpenEdit(admin: AdminUser) {
    setEditingAdmin(admin);
    setUsername(admin.username);
    setPassword("");
    setIsActive(admin.isActive !== undefined ? admin.isActive : true);
    setPermissions(admin.permissions || {});
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username) {
      setError("Username is required.");
      return;
    }
    if (!editingAdmin && !password) {
      setError("Password is required for new admin.");
      return;
    }

    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const payload: any = {
        username,
        isActive,
        permissions,
      };
      if (password) payload.password = password;

      if (editingAdmin) {
        // Edit flow
        await updateAdmin(editingAdmin.id, payload);
        setSuccess(`Admin '${username}' updated successfully.`);
      } else {
        // Create flow
        await createAdmin(payload);
        setSuccess(`Admin '${username}' created successfully.`);
      }
      setIsModalOpen(false);
      loadAdmins();
    } catch (err: any) {
      setError(err.message || "Operation failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(admin: AdminUser) {
    if (!confirm(`Are you sure you want to delete Admin account '${admin.username}'?`)) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      await deleteAdmin(admin.id);
      setSuccess(`Admin '${admin.username}' deleted.`);
      loadAdmins();
    } catch (err: any) {
      setError(err.message || "Deletion failed.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Manage Administrators</h1>
          <p className="text-slate-400 text-sm mt-1">Create, update, and manage access credentials and permissions for Admins.</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-[0_4px_14px_rgba(139,92,246,0.3)] hover:opacity-95 transition-all"
        >
          + Add New Admin
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400 text-sm">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-[#13131a] border border-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1e1e2e] bg-[#1a1a24]/50">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Username</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Created At</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-slate-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e2e]/50">
                {admins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-slate-500 text-sm">
                      No administrator accounts found. Create one to get started.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin) => (
                    <tr key={admin.id} className="hover:bg-[#1a1a24]/20 transition-colors">
                      <td className="p-4 text-sm font-semibold text-slate-200">{admin.username}</td>
                      <td className="p-4 text-sm">
                        {admin.isActive ? (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-red-500/15 text-red-400 border border-red-500/25">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-sm text-slate-400">{new Date(admin.createdAt).toLocaleString()}</td>
                      <td className="p-4 text-sm text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(admin)}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-400 rounded-lg text-xs font-medium cursor-pointer transition-all"
                        >
                          Edit & Permissions
                        </button>
                        <button
                          onClick={() => handleDelete(admin)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/25 border border-red-500/30 text-red-400 rounded-lg text-xs font-medium cursor-pointer transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#13131a] border border-[#1e1e2e] rounded-2xl p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-100">
                  {editingAdmin ? `Edit Admin: ${editingAdmin.username}` : "Create Admin Account"}
                </h2>
                <p className="text-slate-400 text-xs mt-1">
                  Configure authentication details and module access policies.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-lg cursor-pointer bg-transparent border-none outline-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Username</label>
                  <input
                    type="text"
                    placeholder="admin_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-xl py-2.5 px-3.5 text-sm text-slate-200 outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">
                    Password {editingAdmin && <span className="text-slate-600 font-normal">(Leave blank to keep current)</span>}
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0f0f14] border border-[#1e1e2e] rounded-xl py-2.5 px-3.5 text-sm text-slate-200 outline-none focus:border-purple-500"
                    required={!editingAdmin}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#0f0f14] p-4 border border-[#1e1e2e]/50 rounded-xl">
                <input
                  id="admin-active-status"
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer accent-purple-500"
                />
                <label htmlFor="admin-active-status" className="text-sm font-semibold text-slate-200 cursor-pointer">
                  Activate Administrator Account
                </label>
                <p className="text-xs text-slate-500 ml-auto">Deactivating prevents this user from logging in or calling CMS APIs</p>
              </div>

              {/* Permissions Configurator Grid */}
              <PermissionsConfigurator
                permissions={permissions}
                onChange={setPermissions}
              />

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e1e2e]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 bg-transparent border border-[#1e1e2e] text-slate-400 hover:text-slate-200 rounded-xl text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl text-sm font-semibold cursor-pointer border-none shadow-[0_4px_12px_rgba(139,92,246,0.3)] hover:opacity-95 disabled:opacity-70"
                >
                  {submitting ? "Saving..." : "Save Admin & Permissions"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
