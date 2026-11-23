import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { editableBrands, listProducts, visibleBrands } from "@/lib/productQueries";
import { ProductsList, type ListFilters } from "@/_components/userPanelComponents/products/ProductsList";
import styles from '@/_styles/cssUserPanelPage/products/Products.module.css'

export const instant = false;

type SP = Record<string, string | string[] | undefined>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const sp = await searchParams;
  const tab = one(sp.tab);
  const filters: ListFilters = {
    brandId: one(sp.brandId),
    category: one(sp.category),
    subcategory: one(sp.subcategory),
    q: one(sp.q),
    tab: tab === "complete" || tab === "incomplete" || tab === "draft" ? tab : "all",
    view: one(sp.view) === "list" ? "list" : "overview",
    page: Math.max(Number(one(sp.page)) || 1, 1),
  };

  const [result, brands, creatable] = await Promise.all([
    listProducts(user, {
      brandId: Number(filters.brandId) || undefined,
      category: filters.category || undefined,
      subcategory: filters.subcategory || undefined,
      q: filters.q || undefined,
      tab: filters.tab,
      page: filters.page,
      pageSize: filters.view === "list" ? 10 : 12,
    }),
    visibleBrands(user),
    editableBrands(user),
  ]);

  return (

    <main className={styles.container_main}>
      <ProductsList
      items={result.items}
      total={result.total}
      pages={result.pages}
      pageSize={result.pageSize}
      summary={result.summary}
      filters={{ ...filters, page: result.page }}
      brands={brands}
      canCreate={creatable.length > 0}
      />
    </main>

  );
}