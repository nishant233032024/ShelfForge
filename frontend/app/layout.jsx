import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export const metadata = {
  title: "ShelfForge",
  description: "A calm personal book manager for your reading life.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
