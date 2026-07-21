import TemplateFormPage from "@/modules/admin/pages/TemplateFormPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TemplateFormPage id={id} />;
}
