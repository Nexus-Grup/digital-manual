import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  // pdf.js loads its worker file at runtime: keep it out of the server bundle
  serverExternalPackages: ["pdfjs-dist"],
  partialPrefetching: true,
  images: {
    // product photos (Product.imgUrl) uploaded to Supabase Storage
    remotePatterns: [{ protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  // The URLs are in pt-BR. Old English addresses (bookmarks, shared links, search engines) redirect
  // permanently to the new ones; the query string is kept. More specific rules come first.
  async redirects() {
    const r = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      r("/landing-page", "/inicio"),
      r("/products/:productId/assembly", "/produtos/:productId/montagem"),
      r("/products/:productId/information", "/produtos/:productId/informacoes"),
      r("/products/:path*", "/produtos/:path*"),
      r("/login", "/entrar"),
      r("/forgot-password", "/esqueci-a-senha"),
      r("/reset-password", "/redefinir-senha"),

      r("/user-panel/brands/new", "/painel/marcas/nova"),
      r("/user-panel/brands/:brandId/edit", "/painel/marcas/:brandId/editar"),
      r("/user-panel/brands/:path*", "/painel/marcas/:path*"),
      r("/user-panel/companies/new", "/painel/empresas/nova"),
      r("/user-panel/companies/:companyId/edit", "/painel/empresas/:companyId/editar"),
      r("/user-panel/companies/:path*", "/painel/empresas/:path*"),
      r("/user-panel/company-overview", "/painel/visao-geral"),
      r("/user-panel/dashboard", "/painel/indicadores"),
      r("/user-panel/logs", "/painel/registros"),
      r("/user-panel/manage-platform/users/new", "/painel/gerenciar-plataforma/usuarios/novo"),
      r("/user-panel/manage-platform/users/:userId/edit", "/painel/gerenciar-plataforma/usuarios/:userId/editar"),
      r("/user-panel/manage-platform/users", "/painel/gerenciar-plataforma/usuarios"),
      r("/user-panel/manage-platform/:path*", "/painel/gerenciar-plataforma/:path*"),
      r("/user-panel/notifications", "/painel/notificacoes"),
      r("/user-panel/products/new", "/painel/produtos/novo"),
      r("/user-panel/products/:productId/edit", "/painel/produtos/:productId/editar"),
      r("/user-panel/products/:path*", "/painel/produtos/:path*"),
      r("/user-panel/profile", "/painel/perfil"),
      r("/user-panel/settings", "/painel/configuracoes"),
      r("/user-panel/support/new", "/painel/suporte/novo"),
      r("/user-panel/support/:path*", "/painel/suporte/:path*"),
      r("/user-panel/:path*", "/painel/:path*"),
    ];
  },
};

export default nextConfig;