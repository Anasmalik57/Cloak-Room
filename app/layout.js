import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata = {
  title: "Cloak Room",
  description: "Railways Luggage Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
