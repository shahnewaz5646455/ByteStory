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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-500 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              AI Email Writer
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate professional emails instantly with AI. Perfect for business
            communication, customer service, and professional networking.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg p-1 shadow-sm max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "compose"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Compose
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "templates"
                ? "bg-blue-500 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Templates
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Form */}
          {activeTab === "compose" && (
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-500" />
                  Compose Your Email
                </CardTitle>
                <CardDescription>
                  Fill in the details and let AI generate the perfect email for
                  you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Email Purpose */}
                <div className="space-y-2">
                  <Label htmlFor="purpose">Email Purpose *</Label>
                  <Select
                    value={emailData.purpose}
                    onValueChange={(value) =>
                      setEmailData((prev) => ({ ...prev, purpose: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select email purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">
                        Business Communication
                      </SelectItem>
                      <SelectItem value="sales">Sales & Marketing</SelectItem>
                      <SelectItem value="customer-service">
                        Customer Service
                      </SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="networking">Networking</SelectItem>
                      <SelectItem value="job-application">
                        Job Application
                      </SelectItem>
                      <SelectItem value="meeting">Meeting Request</SelectItem>
                      <SelectItem value="thank-you">Thank You</SelectItem>
                      <SelectItem value="apology">Apology</SelectItem>
                      <SelectItem value="announcement">Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Tone */}
                <div className="space-y-2">
                  <Label htmlFor="tone">Tone</Label>
                  <Select
                    value={emailData.tone}
                    onValueChange={(value) =>
                      setEmailData((prev) => ({ ...prev, tone: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="friendly">Friendly</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="persuasive">Persuasive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Key Points */}
                <div className="space-y-3">
                  <Label>Key Points to Include *</Label>
                  {emailData.keyPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Key point ${index + 1}`}
                        value={point}
                        onChange={(e) => updateKeyPoint(index, e.target.value)}
                      />
                      {emailData.keyPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeKeyPoint(index)}
                          className="text-red-500 hover:text-red-700"
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
                    className="w-full"
                  >
                    + Add Another Point
                  </Button>
                </div>

                {/* Recipient Type */}
                <div className="space-y-2">
                  <Label htmlFor="recipientType">Recient Type (Optional)</Label>
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
                  />
                </div>

                {/* Custom Instructions */}
                <div className="space-y-2">
                  <Label htmlFor="customInstructions">
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
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generateEmail}
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-600"
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-blue-500" />
                  My Email Templates
                </CardTitle>
                <CardDescription>
                  Your previously generated and saved email templates
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedTemplates.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
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
                        className="p-4 border rounded-lg hover:border-blue-300 cursor-pointer transition-colors"
                        onClick={() => loadTemplate(template)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {template.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {template.generatedEmail.body}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
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
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Generated Email</span>
                {generatedEmail && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadEmail}>
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm" onClick={saveTemplate}>
                      <Save className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                )}
              </CardTitle>
              <CardDescription>
                Your AI-generated professional email
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!generatedEmail ? (
                <div className="text-center py-12 text-gray-500">
                  <Mail className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Your generated email will appear here</p>
                  <p className="text-sm">
                    Fill out the form and click "Generate Email"
                  </p>
                </div>
              ) : (
                <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                  {/* Subject */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Subject
                    </Label>
                    <div className="mt-1 p-3 bg-white border rounded-md">
                      {generatedEmail.subject}
                    </div>
                  </div>

                  {/* Body */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Body
                    </Label>
                    <div className="mt-1 p-3 bg-white border rounded-md whitespace-pre-wrap min-h-[200px]">
                      {generatedEmail.body}
                    </div>
                  </div>

                  {/* Closing */}
                  <div>
                    <Label className="text-sm font-medium text-gray-700">
                      Closing
                    </Label>
                    <div className="mt-1 p-3 bg-white border rounded-md">
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
