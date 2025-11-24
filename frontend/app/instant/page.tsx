"use client";

import { useMemo, useState } from "react";
import JSZip from "jszip";

type LogoTemplate = {
  id: string;
  label: string;
  category: string;
  description: string;
};

type WebsiteTemplate = {
  id: string;
  label: string;
  businessTypeId: string;
  businessTypeLabel: string;
  description: string;
};

// ---------- Logo templates (200 total via categories × styles) ----------
const LOGO_CATEGORIES = [
  "Minimal",
  "Luxury Serif",
  "Tech Geometric",
  "Bold Street",
  "Graffiti",
  "Retro 70s",
  "Retro 80s Neon",
  "Calligraphy Script",
  "Mascot / Character",
  "Badge / Emblem",
  "Monogram",
  "Urban Culture",
  "Real Estate",
  "Automotive",
  "Beauty & Spa",
  "Corporate Modern",
  "Futuristic",
  "Organic / Nature",
  "Sports Team",
  "3D Metallic",
] as const;

const LOGO_TEMPLATES: LogoTemplate[] = LOGO_CATEGORIES.flatMap(
  (category, catIndex) =>
    Array.from({ length: 10 }, (_, i) => {
      const styleNumber = i + 1;
      return {
        id: `${category.toLowerCase().replace(/\s+|\/|&/g, "-")}-${styleNumber}`,
        label: `${category} – Style ${styleNumber}`,
        category,
        description:
          styleNumber === 1
            ? `Clean, balanced ${category.toLowerCase()} logo ideal for modern brands.`
            : styleNumber === 2
            ? `Slightly more expressive ${category.toLowerCase()} style for eye-catching branding.`
            : `Variation ${styleNumber} in the ${category.toLowerCase()} family.`,
      };
    })
);

// ---------- Website templates (200 total via business types × styles) ----------
const WEBSITE_BUSINESS_TYPES = [
  { id: "barber", label: "Barber Shop" },
  { id: "realtor", label: "Real Estate Agent" },
  { id: "trucking", label: "Trucking / Dispatch" },
  { id: "fitness", label: "Fitness Trainer" },
  { id: "restaurant", label: "Restaurant / Diner" },
  { id: "cleaning", label: "Cleaning Service" },
  { id: "notary", label: "Notary / Loan Signing" },
  { id: "salon", label: "Salon / Beauty" },
  { id: "daycare", label: "Daycare / Childcare" },
  { id: "photography", label: "Photography / Videography" },
  { id: "plumber", label: "Plumber / Home Services" },
  { id: "hvac", label: "HVAC / Heating & Air" },
  { id: "landscaping", label: "Landscaping / Lawn Care" },
  { id: "handyman", label: "Handyman / Repairs" },
  { id: "law", label: "Law Firm / Attorney" },
  { id: "ecommerce", label: "E-Commerce Brand" },
  { id: "course", label: "Online Course / Digital Product" },
  { id: "consultant", label: "Consultant / Coach" },
  { id: "nonprofit", label: "Nonprofit / Community Org" },
  { id: "church", label: "Church / Ministry" },
  { id: "mobile-mechanic", label: "Mobile Mechanic" },
  { id: "credit-repair", label: "Credit Repair / Financial" },
  { id: "car-rental", label: "Car Rental / Turo" },
  { id: "construction", label: "Construction / Contractor" },
  { id: "moving", label: "Moving Company" },
] as const;

// each business type gets 8 layout variations ⇒ 25 * 8 = 200
const WEBSITE_TEMPLATES: WebsiteTemplate[] = WEBSITE_BUSINESS_TYPES.flatMap(
  (bt) =>
    Array.from({ length: 8 }, (_, i) => {
      const styleNumber = i + 1;
      const styleLabel =
        styleNumber === 1
          ? "Bold Hero"
          : styleNumber === 2
          ? "Minimal Clean"
          : styleNumber === 3
          ? "Dark Mode"
          : styleNumber === 4
          ? "Light Premium"
          : styleNumber === 5
          ? "Gradient Hero"
          : styleNumber === 6
          ? "Image-Heavy"
          : styleNumber === 7
          ? "One-Page Scroll"
          : "Luxury Layout";

      return {
        id: `${bt.id}-${styleNumber}`,
        label: `${bt.label} – ${styleLabel}`,
        businessTypeId: bt.id,
        businessTypeLabel: bt.label,
        description: `${bt.label} website with a ${styleLabel.toLowerCase()} layout, optimized for conversions and mobile-first users.`,
      };
    })
);

// Stripe Payment Links – REPLACE these with your real Stripe URLs
const STRIPE_LOGO_PAYMENT_LINK = "https://buy.stripe.com/your_logo_payment_link_here";
const STRIPE_WEBSITE_PAYMENT_LINK = "https://buy.stripe.com/your_website_payment_link_here";
const STRIPE_FULL_SUITE_PAYMENT_LINK = "https://buy.stripe.com/your_500_bundle_payment_link_here";

type TabId = "logo" | "website" | "suite";

export default function InstantPage() {
  const [activeTab, setActiveTab] = useState<TabId>("logo");

  // Logo state
  const [selectedLogoCategory, setSelectedLogoCategory] = useState<string>(
    LOGO_CATEGORIES[0]
  );
  const [selectedLogoId, setSelectedLogoId] = useState<string>(
    LOGO_TEMPLATES[0]?.id ?? ""
  );
  const [logoBusinessName, setLogoBusinessName] = useState("");
  const [logoColors, setLogoColors] = useState("orange, black, white");
  const [logoSlogan, setLogoSlogan] = useState("");
  const [logoPreviewSvg, setLogoPreviewSvg] = useState<string>("");
  const [logoLoading, setLogoLoading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  // Website state
  const [selectedBusinessTypeId, setSelectedBusinessTypeId] = useState<string>(
    WEBSITE_BUSINESS_TYPES[0].id
  );
  const [selectedWebsiteId, setSelectedWebsiteId] = useState<string>(
    WEBSITE_TEMPLATES[0]?.id ?? ""
  );
  const [siteBusinessName, setSiteBusinessName] = useState("");
  const [siteCity, setSiteCity] = useState("Charlotte, NC");
  const [siteServices, setSiteServices] = useState("");
  const [siteColors, setSiteColors] = useState("orange, black, white");
  const [siteCTA, setSiteCTA] = useState("Book Now");
  const [sitePreviewHtml, setSitePreviewHtml] = useState<string>("");
  const [siteLoading, setSiteLoading] = useState(false);
  const [siteError, setSiteError] = useState<string | null>(null);

  // helpers
  const activeLogoTemplates = useMemo(
    () =>
      LOGO_TEMPLATES.filter((t) => t.category === selectedLogoCategory),
    [selectedLogoCategory]
  );

  const activeWebsiteTemplates = useMemo(
    () =>
      WEBSITE_TEMPLATES.filter(
        (t) => t.businessTypeId === selectedBusinessTypeId
      ),
    [selectedBusinessTypeId]
  );

  const selectedLogoTemplate = LOGO_TEMPLATES.find(
    (t) => t.id === selectedLogoId
  );
  const selectedWebsiteTemplate = WEBSITE_TEMPLATES.find(
    (t) => t.id === selectedWebsiteId
  );

  // ---------- LOGO: Generate preview ----------
  const handleGenerateLogo = async () => {
    try {
      setLogoLoading(true);
      setLogoError(null);
      setLogoPreviewSvg("");

      if (!logoBusinessName.trim()) {
        throw new Error("Please enter a business name for the logo.");
      }

      const res = await fetch("/api/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: logoBusinessName,
          colors: logoColors,
          slogan: logoSlogan,
          templateId: selectedLogoId,
          category: selectedLogoTemplate?.category,
          description: selectedLogoTemplate?.description,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.svg) {
        throw new Error(
          data.error ||
            "Failed to generate logo. Please try again or adjust your inputs."
        );
      }

      setLogoPreviewSvg(data.svg as string);
    } catch (err: any) {
      console.error(err);
      setLogoError(err.message || "Something went wrong.");
    } finally {
      setLogoLoading(false);
    }
  };

  // ---------- WEBSITE: Generate preview (uses your existing /api/generate) ----------
  const handleGenerateWebsite = async () => {
    try {
      setSiteLoading(true);
      setSiteError(null);
      setSitePreviewHtml("");

      if (!siteBusinessName.trim()) {
        throw new Error("Please enter a business name for the website.");
      }

      const prompt = `
You are an expert web designer and copywriter.
Generate a complete, mobile-first landing page using HTML + TailwindCSS only, with no external scripts.
Business type: ${selectedWebsiteTemplate?.businessTypeLabel}.
Template style description: ${selectedWebsiteTemplate?.description}.
Business name: ${siteBusinessName}.
Location: ${siteCity}.
Services or offers: ${siteServices || "standard services for this industry"}.
Brand color palette: ${siteColors}.
Primary call-to-action button text: ${siteCTA}.
Return ONLY the HTML for the full page.
`.trim();

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.html) {
        throw new Error(
          data.error ||
            "Failed to generate website. Please try again or adjust your inputs."
        );
      }

      setSitePreviewHtml(data.html as string);
    } catch (err: any) {
      console.error(err);
      setSiteError(err.message || "Something went wrong.");
    } finally {
      setSiteLoading(false);
    }
  };

  // ---------- LOGO: Download ZIP (client-side) ----------
  const handleDownloadLogoZip = async () => {
    if (!logoPreviewSvg || !logoBusinessName.trim()) return;

    const zip = new JSZip();
    const safeName = logoBusinessName.trim().replace(/[^a-z0-9]+/gi, "-");
    zip.file(`logo-${safeName}.svg`, logoPreviewSvg);
    zip.file(
      "readme.txt",
      `Logo generated by EZ Help Technology — FroBot.\nBusiness name: ${logoBusinessName}\nColors: ${logoColors}\nSlogan: ${logoSlogan}\nTemplate: ${selectedLogoTemplate?.label}\n`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `logo-${safeName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---------- WEBSITE: Download ZIP (client-side) ----------
  const handleDownloadWebsiteZip = async () => {
    if (!sitePreviewHtml || !siteBusinessName.trim()) return;

    const zip = new JSZip();
    const safeName = siteBusinessName.trim().replace(/[^a-z0-9]+/gi, "-");

    zip.file(
      "index.html",
      sitePreviewHtml
    );
    zip.file(
      "readme.txt",
      `Website generated by EZ Help Technology — FroBot.\nBusiness name: ${siteBusinessName}\nLocation: ${siteCity}\nServices: ${siteServices}\nColors: ${siteColors}\nCTA: ${siteCTA}\nTemplate: ${selectedWebsiteTemplate?.label}\n`
    );

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `site-${safeName}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ---------- Layout ----------
  return (
    <main className="min-h-screen bg-slate-950 text-white px-4 py-6 md:px-8">
      {/* Top header */}
      <header className="mx-auto mb-8 flex max-w-6xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            60-Second Business Builder
          </h1>
          <p className="mt-1 max-w-xl text-sm text-slate-300">
            Pick a template. Let FroBot customize it.{" "}
            <span className="font-semibold text-amber-300">
              Preview first
            </span>{" "}
            — then pay to download your logo, website, or unlock the full
            $500 business suite.
          </p>
        </div>
        <div className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-1 text-xs font-semibold text-emerald-300">
          EZ Help Technology · FroBot Pro
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-6">
        {/* Tabs */}
        <div className="inline-flex rounded-full border border-slate-800 bg-slate-900/70 p-1 text-xs">
          <button
            onClick={() => setActiveTab("logo")}
            className={`rounded-full px-4 py-1.5 font-semibold transition ${
              activeTab === "logo"
                ? "bg-amber-400 text-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Logos · $50
          </button>
          <button
            onClick={() => setActiveTab("website")}
            className={`rounded-full px-4 py-1.5 font-semibold transition ${
              activeTab === "website"
                ? "bg-amber-400 text-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Websites · $100
          </button>
          <button
            onClick={() => setActiveTab("suite")}
            className={`rounded-full px-4 py-1.5 font-semibold transition ${
              activeTab === "suite"
                ? "bg-amber-400 text-black"
                : "text-slate-300 hover:text-white"
            }`}
          >
            Full Business Suite · $500
          </button>
        </div>

        {/* Active tab content */}
        {activeTab === "logo" && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
            {/* Left: controls */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <h2 className="text-lg font-semibold">Logos · $50 per download</h2>
              <p className="text-sm text-slate-300">
                Choose from{" "}
                <span className="font-semibold text-amber-300">200 logo styles</span>, enter
                your details, preview the logo, then pay to download the ZIP. Or unlock
                unlimited usage with the $500 suite.
              </p>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Logo style family
                </label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={selectedLogoCategory}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSelectedLogoCategory(next);
                    const firstInCat = LOGO_TEMPLATES.find(
                      (t) => t.category === next
                    );
                    if (firstInCat) setSelectedLogoId(firstInCat.id);
                  }}
                >
                  {LOGO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template list */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Specific logo template
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {activeLogoTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedLogoId(tpl.id)}
                      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                        selectedLogoId === tpl.id
                          ? "border-amber-400 bg-amber-400/10 text-amber-200"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold">{tpl.label}</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {tpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Business name
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="Precious Pancakes, Queen City Cuts, etc."
                    value={logoBusinessName}
                    onChange={(e) => setLogoBusinessName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Colors
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="e.g., orange, black, white"
                    value={logoColors}
                    onChange={(e) => setLogoColors(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Slogan (optional)
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="e.g., Charlotte’s Finest Cuts"
                    value={logoSlogan}
                    onChange={(e) => setLogoSlogan(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateLogo}
                disabled={logoLoading}
                className={`mt-3 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${
                  logoLoading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }`}
              >
                {logoLoading ? "Generating logo…" : "Generate Logo Preview"}
              </button>

              {logoError && (
                <p className="text-xs text-red-400 mt-2">{logoError}</p>
              )}
              {!logoError && logoPreviewSvg && (
                <p className="text-xs text-emerald-400 mt-2">
                  ✅ Logo preview ready. Pay below to download the ZIP, or unlock unlimited with the $500 suite.
                </p>
              )}
            </div>

            {/* Right: preview + payment */}
            <div className="flex min-h-[420px] flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Logo preview</h3>
                  <p className="text-xs text-slate-400">
                    Preview first. Then pay $50 to download, or unlock unlimited with the $500 pass.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href={STRIPE_FULL_SUITE_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Unlock Full Business Suite · $500
                  </a>
                </div>
              </div>

              <div className="flex-1 rounded-xl border border-dashed border-slate-700 bg-slate-950/70 flex items-center justify-center p-4">
                {logoPreviewSvg ? (
                  <div className="max-h-[320px] max-w-full overflow-auto rounded-lg bg-white p-4">
                    {/* Render SVG as raw HTML */}
                    <div
                      dangerouslySetInnerHTML={{ __html: logoPreviewSvg }}
                    />
                  </div>
                ) : (
                  <p className="text-sm text-slate-400 text-center">
                    Your logo preview will appear here after you click{" "}
                    <span className="font-semibold text-amber-300">
                      “Generate Logo Preview”.
                    </span>
                  </p>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 text-xs text-slate-400">
                  <p>
                    Step 1 – Pay for this logo:
                  </p>
                  <a
                    href={STRIPE_LOGO_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-slate-100 hover:bg-slate-700"
                  >
                    Pay $50 for this logo
                  </a>
                  <p className="mt-2">
                    Step 2 – After payment, click Download ZIP to save your files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadLogoZip}
                  disabled={!logoPreviewSvg}
                  className={`mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold md:mt-0 ${
                    logoPreviewSvg
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Download Logo ZIP
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "website" && (
          <section className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)]">
            {/* Left: controls */}
            <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-6">
              <h2 className="text-lg font-semibold">Websites · $100 per download</h2>
              <p className="text-sm text-slate-300">
                Choose from{" "}
                <span className="font-semibold text-amber-300">
                  200 website templates
                </span>, preview a full landing page for your niche, then pay to download the ZIP. Or unlock unlimited usage with the $500 suite.
              </p>

              {/* Business type */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Business type
                </label>
                <select
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  value={selectedBusinessTypeId}
                  onChange={(e) => {
                    const next = e.target.value;
                    setSelectedBusinessTypeId(next);
                    const firstTpl = WEBSITE_TEMPLATES.find(
                      (t) => t.businessTypeId === next
                    );
                    if (firstTpl) setSelectedWebsiteId(firstTpl.id);
                  }}
                >
                  {WEBSITE_BUSINESS_TYPES.map((bt) => (
                    <option key={bt.id} value={bt.id}>
                      {bt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Template chooser */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">
                  Layout style
                </label>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {activeWebsiteTemplates.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedWebsiteId(tpl.id)}
                      className={`rounded-xl border px-3 py-2 text-left text-xs transition ${
                        selectedWebsiteId === tpl.id
                          ? "border-amber-400 bg-amber-400/10 text-amber-200"
                          : "border-slate-700 bg-slate-950 text-slate-200 hover:border-slate-500"
                      }`}
                    >
                      <div className="font-semibold">{tpl.label}</div>
                      <div className="mt-1 text-[11px] text-slate-400">
                        {tpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Business name
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="MyTruckTrip Dispatch, Queen City Cuts, etc."
                    value={siteBusinessName}
                    onChange={(e) => setSiteBusinessName(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    City / region
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="e.g., Charlotte, NC"
                    value={siteCity}
                    onChange={(e) => setSiteCity(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Services / offers
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    rows={3}
                    placeholder="Fade cuts, beard trims, braids, mobile dispatch, local moves, etc."
                    value={siteServices}
                    onChange={(e) => setSiteServices(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Colors
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="e.g., orange, black, white"
                    value={siteColors}
                    onChange={(e) => setSiteColors(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Call-to-action text
                  </label>
                  <input
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                    placeholder="Book Now, Get a Quote, Schedule a Call, etc."
                    value={siteCTA}
                    onChange={(e) => setSiteCTA(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateWebsite}
                disabled={siteLoading}
                className={`mt-3 inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${
                  siteLoading
                    ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                    : "bg-amber-400 text-black hover:bg-amber-300"
                }`}
              >
                {siteLoading ? "Generating website…" : "Generate Website Preview"}
              </button>

              {siteError && (
                <p className="text-xs text-red-400 mt-2">{siteError}</p>
              )}
              {!siteError && sitePreviewHtml && (
                <p className="text-xs text-emerald-400 mt-2">
                  ✅ Website preview ready. Pay below to download the ZIP, or unlock unlimited with the $500 suite.
                </p>
              )}
            </div>

            {/* Right: preview + payment */}
            <div className="flex min-h-[420px] flex-col rounded-2xl border border-slate-800 bg-slate-900/60 p-4 md:p-5">
              <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Website preview</h3>
                  <p className="text-xs text-slate-400">
                    Full landing page preview. Pay $100 to download the ZIP, or unlock unlimited with the $500 pass.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <a
                    href={STRIPE_FULL_SUITE_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-emerald-400/60 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    Unlock Full Business Suite · $500
                  </a>
                </div>
              </div>

              <div className="flex-1 overflow-hidden rounded-xl border border-slate-800 bg-black">
                {sitePreviewHtml ? (
                  <iframe
                    title="Website Preview"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    className="h-[360px] w-full bg-white"
                    srcDoc={sitePreviewHtml}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-slate-950/70 px-4 text-center text-sm text-slate-400">
                    Your website preview will appear here after you click{" "}
                    <span className="font-semibold text-amber-300">
                      “Generate Website Preview”.
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="space-y-1 text-xs text-slate-400">
                  <p>Step 1 – Pay for this website:</p>
                  <a
                    href={STRIPE_WEBSITE_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-lg bg-slate-800 px-3 py-1.5 font-semibold text-slate-100 hover:bg-slate-700"
                  >
                    Pay $100 for this website
                  </a>
                  <p className="mt-2">
                    Step 2 – After payment, click Download ZIP to save your files.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadWebsiteZip}
                  disabled={!sitePreviewHtml}
                  className={`mt-2 inline-flex items-center justify-center rounded-xl px-4 py-2 text-xs font-semibold md:mt-0 ${
                    sitePreviewHtml
                      ? "bg-amber-400 text-black hover:bg-amber-300"
                      : "bg-slate-800 text-slate-500 cursor-not-allowed"
                  }`}
                >
                  Download Website ZIP
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "suite" && (
          <section className="rounded-2xl border border-amber-400/40 bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 p-6 md:p-8">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">
                  Full Business Suite Pass · $500
                </h2>
                <p className="text-sm text-slate-200">
                  Unlock <span className="font-semibold text-amber-300">unlimited</span>{" "}
                  logos, websites, contracts, business plans, funnels, flyers, social
                  packs, and more — with{" "}
                  <span className="font-semibold text-emerald-300">
                    no resale fees ever
                  </span>
                  . Build a full agency on top of FroBot and keep 100% of your revenue.
                </p>

                <ul className="space-y-1 text-sm text-slate-200">
                  <li>• Unlimited logo generations (all 200 styles)</li>
                  <li>• Unlimited website generations (all 200 templates)</li>
                  <li>• Unlimited contracts and business docs</li>
                  <li>• Unlimited marketing packs and funnels</li>
                  <li>• Unlimited exports — ZIPs, copy, assets</li>
                  <li>• Full commercial rights on everything</li>
                  <li>• Zero per-project or resale fees forever</li>
                </ul>

                <div className="rounded-xl border border-amber-400/50 bg-amber-500/10 p-4 text-xs text-amber-100">
                  <p className="font-semibold mb-1">
                    This is the hustler license.
                  </p>
                  <p>
                    Pay once, use FroBot forever to build brands, websites, and
                    documents for as many clients as you want. You keep all the
                    money — FroBot is your engine behind the scenes.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={STRIPE_FULL_SUITE_PAYMENT_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-300"
                  >
                    Unlock Full Business Suite · $500
                  </a>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    After payment, you’ll receive an email or access code from EZ Help
                    Technology that unlocks unlimited usage inside your account.
                  </p>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  What you can resell with the pass:
                </h3>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li>• Websites ($300–$800+ per project)</li>
                  <li>• Logos ($50–$250 per logo)</li>
                  <li>• Brand kits and social packs</li>
                  <li>• Contracts, proposals, and intake forms</li>
                  <li>• Funnels and landing pages</li>
                  <li>• Simple business plans and pitch decks</li>
                </ul>

                <div className="mt-4 space-y-1 text-xs text-slate-400">
                  <p className="font-semibold text-slate-200">
                    Example hustle math:
                  </p>
                  <p>
                    • Sell 3 websites at $400 = $1,200
                  </p>
                  <p>
                    • Sell 10 logos at $75 = $750
                  </p>
                  <p>
                    • Total = $1,950 from a $500 pass
                  </p>
                  <p className="mt-2 text-emerald-300">
                    Everything after that is pure profit.
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
