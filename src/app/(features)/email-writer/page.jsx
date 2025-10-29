"use client";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Copy,
  Download,
  Save,
  Star,
  History,
  Sparkles,
  RefreshCw,
  Key,
  X,
  ShoppingCart,
  Wifi,
  WifiOff,
  AlertTriangle,
  Trash2,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

// Initialize Stripe with your public key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function EmailWriter() {
  const auth = useSelector((store) => store.authStore.auth);
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState({
    purpose: "",
    tone: "professional",
    keyPoints: [""],
    recipientType: "",
    customInstructions: "",
  });
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [activeTab, setActiveTab] = useState("compose");

  // ---- Blog Key State ----
  const [emailKeyCount, setEmailKeyCount] = useState(0);
  const [userData, setUserData] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(false);

  // ---- Network State ----
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [showNetStatus, setShowNetStatus] = useState(false);
  const [showWaitingButton, setShowWaitingButton] = useState(false);
  const [showOffNetStatus, setShowOffNetStatus] = useState(!isOnline);
  const [hasNetworkChanged, setHasNetworkChanged] = useState(false);
  const [pendingRequest, setPendingRequest] = useState(null);

  // ---- Network listeners ----
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setHasNetworkChanged(true);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setHasNetworkChanged(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // ---- Status banners + auto-run pending ----
  useEffect(() => {
    if (!hasNetworkChanged) return;

    if (isOnline) {
      setShowOffNetStatus(false);
      setShowWaitingButton(false);
      setShowNetStatus(true);

      // Auto-execute pending request when network comes back
      if (pendingRequest) {
        executeGenerateContent(pendingRequest.emailData);
        setPendingRequest(null);
      }

      const t = setTimeout(() => setShowNetStatus(false), 4000);
      return () => clearTimeout(t);
    } else {
      setShowNetStatus(false);
      setShowOffNetStatus(true);
      setLoading(false);
    }
  }, [isOnline, hasNetworkChanged, pendingRequest]);

  // ---- Fetch User Data and Blog Keys ----
  const fetchUserData = async () => {
    if (!auth?.email) {
      console.log(" No user email found in Redux store");
      return;
    }

    try {
      console.log("🔍 Fetching user data from database for:", auth.email);

      const response = await fetch(
        `/api/get-user-data?email=${encodeURIComponent(auth.email)}`
      );
      const data = await response.json();

      if (data.success) {
        setUserData(data.user);
        setEmailKeyCount(data.user.email_key || 0);

        console.log("✅ USER DATA FROM DATABASE:");
        console.log("📧 Email:", data.user.email);
        console.log("👤 Name:", data.user.name);
        console.log("🔑 Email Keys:", data.user.email_key);
      } else {
        console.error("❌ Failed to fetch user data:", data.message);
      }
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
    }
  };

  // ---- Update Blog Key Count in Database ----
  const updateEmailKeyInDB = async (newCount) => {
    if (!auth?.email) return;

    try {
      const response = await fetch("/api/update-email-keys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: auth.email,
          email_key: newCount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        console.log("✅ Email keys updated in database:", newCount);
        setEmailKeyCount(newCount);
      } else {
        console.error("❌ Failed to update email keys:", data.message);
      }
    } catch (error) {
      console.error("❌ Error updating email keys:", error);
    }
  };

  // ---- Check email Keys Before API Call ----
  const checkAndUseEmailKey = async () => {
    if (!auth) {
      toast.error("Please login to use AI writing tool");
      return false;
    }

    if (emailKeyCount <= 0) {
      setShowKeyModal(true);
      return false;
    }

    // Deduct one key and update database
    const newCount = emailKeyCount - 1;
    await updateEmailKeyInDB(newCount);
    return true;
  };

  // Fetch saved templates and user data
  useEffect(() => {
    if (auth?._id) {
      fetchTemplates();
      fetchUserData();
    }
  }, [auth?._id]);

  // Fetch only current user's templates
  const fetchTemplates = async () => {
    if (!auth?._id) return;

    try {
      const response = await fetch(
        `/api/email-writer/templates?userId=${auth._id}`
      );
      const data = await response.json();
      if (data.success) {
        setSavedTemplates(data.templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  // Delete template function
  const deleteTemplate = async (templateId) => {
    if (!confirm("Are you sure you want to delete this template?")) {
      return;
    }

    try {
      const response = await fetch("/api/email-writer/templates", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateId: templateId,
          userId: auth._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Template deleted successfully!");
        // Remove from local state
        setSavedTemplates((prev) =>
          prev.filter((template) => template._id !== templateId)
        );

        // If the deleted template is currently loaded, clear it
        if (
          generatedEmail &&
          savedTemplates.find((t) => t._id === templateId)?.generatedEmail ===
            generatedEmail
        ) {
          setGeneratedEmail(null);
        }
      } else {
        toast.error(data.error || "Failed to delete template");
      }
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Something went wrong while deleting template");
    }
  };

  const addKeyPoint = () => {
    setEmailData((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""],
    }));
  };

  const updateKeyPoint = (index, value) => {
    const newKeyPoints = [...emailData.keyPoints];
    newKeyPoints[index] = value;
    setEmailData((prev) => ({
      ...prev,
      keyPoints: newKeyPoints,
    }));
  };

  const removeKeyPoint = (index) => {
    if (emailData.keyPoints.length > 1) {
      const newKeyPoints = emailData.keyPoints.filter((_, i) => i !== index);
      setEmailData((prev) => ({
        ...prev,
        keyPoints: newKeyPoints,
      }));
    }
  };

  // ---- Modified API execution function ----
  const executeGenerateContent = async (emailDataToUse) => {
    // First check if user has email keys
    const hasKeys = await checkAndUseEmailKey();
    if (!hasKeys) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedEmail(null);

    try {
      const response = await fetch("/api/email-writer/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emailDataToUse,
          userId: auth._id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedEmail(data.email);
        toast.success("Email generated successfully!");
      } else {
        toast.error(data.error || "Failed to generate email");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const generateEmail = async () => {
    const validKeyPoints = emailData.keyPoints.filter(
      (point) => point.trim() !== ""
    );

    if (!emailData.purpose) {
      toast.error("Please select an email purpose");
      return;
    }

    if (validKeyPoints.length === 0) {
      toast.error("Please add at least one key point");
      return;
    }

    if (!auth?._id) {
      toast.error("Please login to use this feature");
      return;
    }

    if (!isOnline) {
      // Store the request for auto-execution when network returns
      setPendingRequest({
        emailData: {
          ...emailData,
          keyPoints: validKeyPoints,
        },
      });
      setShowWaitingButton(true);
      toast.info("Request queued. Will process when network is restored.");
      return;
    }

    await executeGenerateContent({
      ...emailData,
      keyPoints: validKeyPoints,
    });
  };

  const saveTemplate = async () => {
    if (!generatedEmail) {
      toast.error("No email to save");
      return;
    }

    try {
      const response = await fetch("/api/email-writer/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: auth._id,
          title: `${emailData.purpose
            } Email - ${new Date().toLocaleDateString()}`,
          purpose: emailData.purpose,
          tone: emailData.tone,
          keyPoints: emailData.keyPoints.filter((point) => point.trim() !== ""),
          generatedEmail: generatedEmail,
          isFavorite: false,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Email template saved!");
        fetchTemplates(); // Refresh templates list
      } else {
        toast.error(data.error || "Failed to save template");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const copyToClipboard = () => {
    if (!generatedEmail) return;

    const fullEmail = `${generatedEmail.subject}\n\n${generatedEmail.body}\n\n${generatedEmail.closing}`;
    navigator.clipboard.writeText(fullEmail);
    toast.success("Copied to clipboard!");
  };

  const downloadEmail = () => {
    if (!generatedEmail) return;

    const fullEmail = `${generatedEmail.subject}\n\n${generatedEmail.body}\n\n${generatedEmail.closing}`;
    const element = document.createElement("a");
    const file = new Blob([fullEmail], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "generated-email.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Email downloaded!");
  };

  const loadTemplate = (template) => {
    setEmailData({
      purpose: template.purpose,
      tone: template.tone,
      keyPoints: template.keyPoints,
      recipientType: "",
      customInstructions: "",
    });
    setGeneratedEmail(template.generatedEmail);
    setActiveTab("compose");
    toast.success("Template loaded!");
  };

  // Error state
  const [error, setError] = useState("");
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lineItems: [
            {
              price_data: {
                currency: "usd",
                product_data: { name: "AI powered Email compose" },
                unit_amount: 100,
              },
              quantity: 1,
            },
          ],
        }),
      });

      const data = await res.json();

      // Redirect using Stripe-hosted URL if available
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback: redirect using session ID
      if (data.id) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.id });
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-950 dark:via-gray-800 dark:to-gray-950 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200 py-12 px-4">
      {/* Online banner */}
      {showNetStatus && (
        <div className="sticky top-0 z-50 animate-pulse bg-green-500 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <Wifi className="h-5 w-5 text-white" />
            <h1 className="text-lg font-semibold text-white">
              You are back online !✅
            </h1>
          </div>
        </div>
      )}

      {/* Offline banner */}
      {showOffNetStatus && (
        <div className="sticky top-0 z-50 bg-red-600 py-3 px-4 text-center shadow-lg">
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="h-5 w-5 text-white animate-pulse" />
            <h1 className="text-lg font-semibold text-white">
              You are currently offline
            </h1>
          </div>
          <p className="mt-1 text-sm text-red-100">
            Requests will be processed when network is restored
          </p>
        </div>
      )}

      {/* Key Purchase Modal */}
      <AnimatePresence>
        {showKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-gray-800"
            >
              {/* Close Button */}
              <button
                onClick={() => setShowKeyModal(false)}
                className="absolute right-4 top-4 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300"
              >
                <X size={20} />
              </button>

              {/* Modal Content */}
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <Key className="h-8 w-8 text-red-600 dark:text-red-400" />
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
                  No Email Keys Left!
                </h3>

                <p className="mb-6 text-gray-600 dark:text-gray-300">
                  You have used all your available email keys. Purchase more
                  keys to continue using the AI Email Writer.
                </p>

                {/* Key Package */}
                <div className="mb-6 rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-900/20">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                        10 Email Keys Package
                      </h4>
                      <p className="text-sm text-amber-600 dark:text-amber-400">
                        Generate 10 AI emails
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        $1
                      </p>
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        $0.10 per email
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowKeyModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Maybe Later
                  </button>

                  <button
                    onClick={() => {
                      handleCheckout();
                      setShowKeyModal(false);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 font-medium text-white transition-all hover:from-amber-600 hover:to-orange-600"
                  >
                    <ShoppingCart size={18} />
                    Buy Now
                  </button>
                </div>

                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Secure payment • Instant delivery • Money back guarantee
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
       <div className="text-center mb-8">
  <div className="flex items-center justify-center gap-3 mb-4 cursor-default">
    <div className="md:p-3 p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full cursor-default">
      <Mail className="md:h-8 md:w-8 h-5 w-5 text-white cursor-default" />
    </div>
    <h1 className="md:text-4xl text-3xl font-bold text-gray-900 dark:text-white cursor-default">
      AI Email Writer
    </h1>
  </div>
  <p className="md:text-lg text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto cursor-default">
    Generate professional emails instantly with AI. Perfect for business communication, customer service, and professional networking.
  </p>
</div>

        {/* Email Key Counter */}
        {auth && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 flex md:justify-end justify-center"
          >
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 shadow-lg border border-amber-200/50 dark:from-amber-900/20 dark:to-yellow-900/20 dark:border-amber-700/30">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Key className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-1 -right-1 h-2 w-2 bg-green-500 rounded-full"
                  />
                </div>
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  Email Keys
                </span>
              </div>
              <div className="h-6 w-px bg-amber-300 dark:bg-amber-600" />
              <motion.div
                key={emailKeyCount}
                initial={{ scale: 1.5 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1"
              >
                <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                  {emailKeyCount}
                </span>
                <span className="text-xs text-amber-600 dark:text-amber-400">
                  available
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm max-w-md mx-auto cursor-pointer">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === "compose"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${activeTab === "templates"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            My Templates
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Form */}
          {activeTab === "compose" && (
            <Card className="h-fit border-gray-200 dark:border-gray-700 cursor-default">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white cursor-default">
                  <Sparkles className="h-5 w-5 text-indigo-500 cursor-default" />
                  Compose Your Email
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 cursor-default">
                  Fill in the details and let AI generate the perfect email for
                  you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Email Purpose */}
                <div className="space-y-2">
                  <Label
                    htmlFor="purpose"
                    className="text-gray-900 dark:text-white cursor-default"
                  >
                    Email Purpose *
                  </Label>
                  <Select
                    value={emailData.purpose}
                    onValueChange={(value) =>
                      setEmailData((prev) => ({ ...prev, purpose: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer">
                      <SelectValue placeholder="Select email purpose" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem
                        value="business"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Business Communication
                      </SelectItem>
                      <SelectItem
                        value="sales"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Sales & Marketing
                      </SelectItem>
                      <SelectItem
                        value="customer-service"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Customer Service
                      </SelectItem>
                      <SelectItem
                        value="follow-up"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Follow-up
                      </SelectItem>
                      <SelectItem
                        value="networking"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Networking
                      </SelectItem>
                      <SelectItem
                        value="job-application"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Job Application
                      </SelectItem>
                      <SelectItem
                        value="meeting"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Meeting Request
                      </SelectItem>
                      <SelectItem
                        value="thank-you"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Thank You
                      </SelectItem>
                      <SelectItem
                        value="apology"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Apology
                      </SelectItem>
                      <SelectItem
                        value="announcement"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Announcement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label
                    htmlFor="tone"
                    className="text-gray-900 dark:text-white cursor-default"
                  >
                    Tone
                  </Label>
                  <Select
                    value={emailData.tone}
                    onValueChange={(value) =>
                      setEmailData((prev) => ({ ...prev, tone: value }))
                    }
                  >
                    <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                      <SelectItem
                        value="professional"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Professional
                      </SelectItem>
                      <SelectItem
                        value="friendly"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Friendly
                      </SelectItem>
                      <SelectItem
                        value="formal"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Formal
                      </SelectItem>
                      <SelectItem
                        value="casual"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Casual
                      </SelectItem>
                      <SelectItem
                        value="persuasive"
                        className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        Persuasive
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Key Points */}
                <div className="space-y-3">
                  <Label className="text-gray-900 dark:text-white cursor-default">
                    Key Points to Include *
                  </Label>
                  {emailData.keyPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Key point ${index + 1}`}
                        value={point}
                        onChange={(e) => updateKeyPoint(index, e.target.value)}
                        className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-text"
                      />
                      {emailData.keyPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeKeyPoint(index)}
                          className="text-red-500 hover:text-red-700 border-red-200 dark:border-red-800 cursor-pointer"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addKeyPoint}
                    className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    + Add Another Point
                  </Button>
                </div>

                {/* Recipient Type */}
                <div className="space-y-2">
                  <Label
                    htmlFor="recipientType"
                    className="text-gray-900 dark:text-white cursor-default"
                  >
                    Recipient Type (Optional)
                  </Label>
                  <Input
                    id="recipientType"
                    placeholder="e.g., Client, Colleague, Hiring Manager"
                    value={emailData.recipientType}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        recipientType: e.target.value,
                      }))
                    }
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-text"
                  />
                </div>

                {/* Custom Instructions */}
                <div className="space-y-2">
                  <Label
                    htmlFor="customInstructions"
                    className="text-gray-900 dark:text-white cursor-default"
                  >
                    Custom Instructions (Optional)
                  </Label>
                  <Textarea
                    id="customInstructions"
                    placeholder="Any specific requirements or style preferences..."
                    value={emailData.customInstructions}
                    onChange={(e) =>
                      setEmailData((prev) => ({
                        ...prev,
                        customInstructions: e.target.value,
                      }))
                    }
                    rows={3}
                    className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-text"
                  />
                </div>

                {/* Waiting for Network Button */}
                {showWaitingButton && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50 p-4 dark:border-yellow-700 dark:from-yellow-900/20 dark:to-orange-900/20"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-2 text-lg font-semibold text-yellow-800 dark:text-yellow-200">
                          Waiting for Network Connection
                        </h4>
                        <p className="mb-3 text-sm text-yellow-700 dark:text-yellow-300">
                          Your request is queued and will be processed
                          automatically when internet connection is restored.
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 1.5, repeat: Infinity }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: 0.3,
                              }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: 0.6,
                              }}
                              className="h-2 w-2 rounded-full bg-yellow-500"
                            />
                          </div>
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                            Monitoring network status...
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Generate Button */}
                <Button
                  onClick={generateEmail}
                  disabled={loading || !auth}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer disabled:cursor-not-allowed"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : !auth ? (
                    "Please Login to Generate"
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Email ({emailKeyCount} keys left)
                    </>
                  )}
                </Button>

                {!auth && (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                    You need to be logged in to use the AI Email Writer
                  </p>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 flex items-center text-sm text-red-500"
                  >
                    <span className="mr-1">⚠️</span> {error}
                  </motion.p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <Card className="border-gray-200 dark:border-gray-700 cursor-default">
              <CardHeader className="">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white cursor-default">
                  <History className="h-5 w-5 text-indigo-500 cursor-default" />
                  My Email Templates
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 cursor-default">
                  Your previously generated and saved email templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!auth ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 cursor-default">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50 cursor-default" />
                    <p>Please login to view your templates</p>
                  </div>
                ) : savedTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400 cursor-default">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50 cursor-default" />
                    <p>No templates saved yet</p>
                    <p className="text-sm">
                      Generate and save your first email template
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {savedTemplates.map((template) => (
                      <motion.div
                        key={template._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="group relative p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                        onClick={() => loadTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                              {template.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2 cursor-pointer">
                              {template.generatedEmail.body}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400 cursor-pointer">
                              <span className="capitalize">
                                {template.purpose}
                              </span>
                              <span>•</span>
                              <span className="capitalize">
                                {template.tone}
                              </span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  template.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 ml-2">
                            {template.isFavorite && (
                              <Star className="h-4 w-4 text-yellow-500 fill-current cursor-pointer" />
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteTemplate(template._id);
                              }}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-all"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Right Side - Generated Email */}
          <Card className="border-gray-200 dark:border-gray-700 cursor-default">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-900 dark:text-white cursor-default">
                <span>Generated Email</span>
                {generatedEmail && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadEmail}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={saveTemplate}
                      className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300 cursor-default">
                Your AI-generated professional email
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedEmail ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400 cursor-default">
                  <Mail className="h-16 w-16 mx-auto mb-4 opacity-50 cursor-default" />
                  <p>Your generated email will appear here</p>
                  <p className="text-sm">
                    Fill out the form and click "Generate Email"
                  </p>
                </div>
              ) : (
                <div className="space-y-6 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg cursor-default">
                  {/* Subject */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-default">
                      Subject
                    </Label>
                    <div className="mt-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white cursor-text">
                      {generatedEmail.subject}
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-default">
                      Body
                    </Label>
                    <div className="mt-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md whitespace-pre-wrap min-h-[200px] text-gray-900 dark:text-white cursor-text">
                      {generatedEmail.body}
                    </div>
                  </div>

                  {/* Closing */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-default">
                      Closing
                    </Label>
                    <div className="mt-1 p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white cursor-text">
                      {generatedEmail.closing}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
