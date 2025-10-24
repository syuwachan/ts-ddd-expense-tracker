import "./globals.css";
import { Providers } from "./providers";
import Sidebar from "@/components/Sidebar";
  
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex min-h-screen">
            <Sidebar/>
            <main className="flex-1 p-8 bg-gray-50">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
