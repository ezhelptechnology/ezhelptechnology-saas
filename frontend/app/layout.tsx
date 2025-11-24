import "./globals.css";

export const metadata = {
  title: "EZ Help Technology – FroBot Builder",
  description: "Build your business instantly with FroBot AI."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="max-w-5xl mx-auto p-6">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ezOrange to-yellow-400 flex items-center justify-center text-black font-bold">
              EZ
            </div>
            <span className="text-xl font-semibold">EZ Help Technology</span>
          </div>

          <nav className="space-x-4 text-sm">
            <a
              href="/"
              className="text-slate-300 hover:text-ezOrange transition-colors"
            >
              Home
            </a>
            <a
              href="/dashboard"
              className="text-slate-300 hover:text-ezOrange transition-colors"
            >
              Dashboard
            </a>
            <a
              href="/pricing"
              className="text-slate-300 hover:text-ezOrange transition-colors"
            >
              Pricing
            </a>
          </nav>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}

