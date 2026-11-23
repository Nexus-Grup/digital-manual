import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { editableBrands } from "@/lib/productQueries";
import { ProductWizard } from "@/_components/userPanelComponents/products/ProductWizard";

export const instant = false;

export default async function NewProductPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  // só quem pode criar produto em alguma marca (OWNER, MANAGER, ADMIN ou EDITOR da marca)
  const brands = await editableBrands(user);
  if (brands.length === 0) redirect("/user-panel/products");

  return <ProductWizard product={null} brands={brands} initialStep={1} />;
}