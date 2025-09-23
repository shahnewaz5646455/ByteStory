import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "../../components/theme-provider";
import GlobalStoreProvider from "@/components/ui/Application/GlobalStoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ByteStory",
  description: "AI Powered blogging platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning={true}
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <GlobalStoreProvider>
              <Navbar />
              {children}
            </GlobalStoreProvider>
            <ToastContainer />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
