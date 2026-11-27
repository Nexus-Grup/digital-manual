import type { Metadata } from "next";
import localFont from "next/font/local";
import "@/_styles/global/globals.css";
import { SkipLink } from "@/_components/global/SkipLink";

/*
 * Brand typeface: Greycliff CF only (the logo's typeface), 2 files. Two roles:
 *
 * - --font-display: Greycliff CF Bold at any weight: page and section titles, eyebrows/tags,
 *   highlighted numbers and button labels. Short text only.
 * - --font-body: Greycliff CF Regular for everything people read or fill in (paragraphs, lists, forms,
 *   tables, menus, captions, messages), Bold for emphasis (<strong>, weight >= 600).
 * Both roles point to the same Bold file, so the browser downloads it once.
 *
 * Self-hosted WOFF2 with font-display: swap and a metric-adjusted Arial fallback (no layout shift).
 * ascent/descent overrides (95% / 25%) put the cap height in the middle of the line box, so text is
 * centered with icons in buttons, menus and chips (the fonts' own metrics leave it low).
 * next/font only accepts literal values, so the overrides are repeated in both calls.
 */
const displayFont = localFont({
  src: [{ path: "../_assets/fonts/GreycliffCF-Bold.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-display",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
  declarations: [
    { prop: "ascent-override", value: "95%" },
    { prop: "descent-override", value: "25%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

const bodyFont = localFont({
  src: [
    { path: "../_assets/fonts/GreycliffCF-Regular.woff2", weight: "100 599", style: "normal" },
    { path: "../_assets/fonts/GreycliffCF-Bold.woff2", weight: "600 900", style: "normal" },
  ],
  variable: "--font-body",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  adjustFontFallback: "Arial",
  declarations: [
    { prop: "ascent-override", value: "95%" },
    { prop: "descent-override", value: "25%" },
    { prop: "line-gap-override", value: "0%" },
  ],
});

// Fallback for pages without their own title (each public page sets "Name | Manual digital";
// the panel layout adds its own template)
export const metadata: Metadata = {
  title: "Manual digital",
  description:
    "Manuais digitais interativos, acessíveis e sustentáveis: montagem em 3D, Libras, leitura em voz alta e acesso pelo QR Code da embalagem.",
};

// Contrast mode (ContrastToggle) applied before the first paint, so a page never flashes in the default
// colors for someone who chose high contrast or grayscale. Same rules as the toggle: the saved choice,
// or high contrast when the system asks for more contrast. Only on the pages that have the toggle.
const CONTRAST_SCRIPT = `(function(){try{
if(!/^\\/(inicio|produtos|painel)(\\/|$)/.test(location.pathname))return;
var s=localStorage.getItem("contrast");
var m=s==="high"||s==="gray"?s:(s===null&&matchMedia("(prefers-contrast: more)").matches?"high":null);
if(m)document.documentElement.setAttribute("data-contrast",m);
}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: smooth scroll for in-page anchors (header nav), while Next keeps route changes instant
    // suppressHydrationWarning: data-contrast is set by the inline script before React hydrates
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: CONTRAST_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col">
        {/* first Tab stop of every page: jumps over header and menus (WCAG 2.4.1) */}
        <SkipLink />
        {children}
      </body>
    </html>
  );
}
