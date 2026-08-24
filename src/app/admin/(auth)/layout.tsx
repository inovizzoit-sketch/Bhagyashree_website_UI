"use client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 font-sans p-4 sm:p-6 md:p-8 admin-theme-light">
      {children}
    </div>
  );
}
