import ThemeFormPage from "@/modules/admin/pages/ThemeFormPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ThemeFormPage id={id} />;
}
