import { Open_Sans } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import { ThemeProvider } from "../../components/theme-provider";
import GlobalStoreProvider from "@/components/ui/Application/GlobalStoreProvider";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Toaster } from "@/components/ui/sonner";
import GlobalNotepad from "../../components/GlobalNotepad";
import ScrollToTop from "@/components/ScrollToTop";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
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
        className={`${openSans.variable} antialiased`}
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
              <GlobalNotepad />
              <Footer />
              <ScrollToTop />
            </GlobalStoreProvider>
            <ToastContainer />

            <Toaster position="top-center" richColors closeButton />
          </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
