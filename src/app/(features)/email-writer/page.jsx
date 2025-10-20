// app/email-writer/page.jsx
"use client";

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
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

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

  // Fetch saved templates
  useEffect(() => {
    if (auth?._id) {
      fetchTemplates();
    }
  }, [auth?._id]);

  const fetchTemplates = async () => {
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

    setLoading(true);
    try {
      const response = await fetch("/api/email-writer/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...emailData,
          keyPoints: validKeyPoints,
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
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
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
          title: `${
            emailData.purpose
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 via-white to-purple-50 text-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4 cursor-default">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full cursor-default">
              <Mail className="h-8 w-8 text-white cursor-default" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white cursor-default">
              AI Email Writer
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto cursor-default">
            Generate professional emails instantly with AI. Perfect for business
            communication, customer service, and professional networking.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm max-w-md mx-auto cursor-pointer">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "compose"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === "templates"
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
                  <Label htmlFor="purpose" className="text-gray-900 dark:text-white cursor-default">Email Purpose *</Label>
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
                      <SelectItem value="business" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Business Communication
                      </SelectItem>
                      <SelectItem value="sales" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Sales & Marketing
                      </SelectItem>
                      <SelectItem value="customer-service" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="follow-up" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Follow-up
                      </SelectItem>
                      <SelectItem value="networking" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Networking
                      </SelectItem>
                      <SelectItem value="job-application" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Job Application
                      </SelectItem>
                      <SelectItem value="meeting" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Meeting Request
                      </SelectItem>
                      <SelectItem value="thank-you" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Thank You
                      </SelectItem>
                      <SelectItem value="apology" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Apology
                      </SelectItem>
                      <SelectItem value="announcement" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">
                        Announcement
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone" className="text-gray-900 dark:text-white cursor-default">Tone</Label>
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
                      <SelectItem value="professional" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">Professional</SelectItem>
                      <SelectItem value="friendly" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">Friendly</SelectItem>
                      <SelectItem value="formal" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">Formal</SelectItem>
                      <SelectItem value="casual" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">Casual</SelectItem>
                      <SelectItem value="persuasive" className="hover:bg-indigo-50 dark:hover:bg-gray-700 cursor-pointer">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Key Points */}
                <div className="space-y-3">
                  <Label className="text-gray-900 dark:text-white cursor-default">Key Points to Include *</Label>
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
                  <Label htmlFor="recipientType" className="text-gray-900 dark:text-white cursor-default">Recipient Type (Optional)</Label>
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
                  <Label htmlFor="customInstructions" className="text-gray-900 dark:text-white cursor-default">
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

                {/* Generate Button */}
                <Button
                  onClick={generateEmail}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white cursor-pointer disabled:cursor-not-allowed"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Email
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <Card className="border-gray-200 dark:border-gray-700 cursor-default">
              <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
                <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white cursor-default">
                  <History className="h-5 w-5 text-indigo-500 cursor-default" />
                  My Email Templates
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 cursor-default">
                  Your previously generated and saved email templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedTemplates.length === 0 ? (
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
                      <div
                        key={template._id}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-600 cursor-pointer transition-colors bg-white dark:bg-gray-800"
                        onClick={() => loadTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
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
                              <span>{template.wordCount} words</span>
                            </div>
                          </div>
                          {template.isFavorite && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current cursor-pointer" />
                          )}
                        </div>
                      </div>
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