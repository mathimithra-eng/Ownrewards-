"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { MessageSquare, Star, Image as ImageIcon, Send, FileCheck, AlertCircle, Loader2 } from "lucide-react";

type TabType = "suggestion" | "feedback";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_TEXT_LENGTH = 500;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/jpg"];

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("suggestion");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Lifted form state to preserve across tab switches
  const [suggestionText, setSuggestionText] = useState("");
  const [feedbackPurchaseId, setFeedbackPurchaseId] = useState("");
  const [feedbackRating, setFeedbackRating] = useState("");
  const [feedbackComment, setFeedbackComment] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Error states
  const [fileError, setFileError] = useState("");
  const [submitError, setSubmitError] = useState("");
  
  // Load drafts from localStorage on mount
  useEffect(() => {
    const savedSuggestion = localStorage.getItem("draft_suggestionText");
    if (savedSuggestion) setSuggestionText(savedSuggestion);

    const savedPurchaseId = localStorage.getItem("draft_feedbackPurchaseId");
    if (savedPurchaseId) setFeedbackPurchaseId(savedPurchaseId);

    const savedRating = localStorage.getItem("draft_feedbackRating");
    if (savedRating) setFeedbackRating(savedRating);

    const savedComment = localStorage.getItem("draft_feedbackComment");
    if (savedComment) setFeedbackComment(savedComment);
  }, []);

  // Save drafts to localStorage on change
  useEffect(() => {
    localStorage.setItem("draft_suggestionText", suggestionText);
  }, [suggestionText]);

  useEffect(() => {
    localStorage.setItem("draft_feedbackPurchaseId", feedbackPurchaseId);
  }, [feedbackPurchaseId]);

  useEffect(() => {
    localStorage.setItem("draft_feedbackRating", feedbackRating);
  }, [feedbackRating]);

  useEffect(() => {
    localStorage.setItem("draft_feedbackComment", feedbackComment);
  }, [feedbackComment]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "suggestion" || tab === "feedback") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isHeic = selected.name.toLowerCase().endsWith('.heic');
    if (!ALLOWED_IMAGE_TYPES.includes(selected.type) && !isHeic) {
      setFileError("Please upload a valid image (JPEG, PNG, WEBP, or HEIC).");
      setFile(null);
      return;
    }

    if (selected.size > MAX_FILE_SIZE) {
      setFileError("File size must be less than 5MB.");
      setFile(null);
      return;
    }

    setFile(selected);
  };

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    
    if (suggestionText.length > MAX_TEXT_LENGTH) {
      setSubmitError("Suggestion exceeds the maximum character limit.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", "suggestion");
      formData.append("text", suggestionText);

      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      setSuggestionText("");
      localStorage.removeItem("draft_suggestionText");
    } catch (error) {
      setSubmitError("Failed to submit suggestion. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    if (feedbackComment.length > MAX_TEXT_LENGTH) {
      setSubmitError("Feedback comment exceeds the maximum character limit.");
      return;
    }

    if (!/^[1-5]$/.test(feedbackRating)) {
      setSubmitError("Please enter a valid whole number between 1 and 5 for the rating.");
      return;
    }

    if (!file) {
      setFileError("Please upload a purchase image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", "feedback");
      formData.append("purchaseId", feedbackPurchaseId);
      formData.append("rating", feedbackRating);
      formData.append("comment", feedbackComment);
      formData.append("file", file);

      const res = await fetch("/api/feedback", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setIsSubmitted(true);
      
      // Reset feedback state & clear drafts
      setFeedbackPurchaseId("");
      setFeedbackRating("");
      setFeedbackComment("");
      setFile(null);
      const fileInput = document.getElementById("image-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      localStorage.removeItem("draft_feedbackPurchaseId");
      localStorage.removeItem("draft_feedbackRating");
      localStorage.removeItem("draft_feedbackComment");
    } catch (error) {
      setSubmitError("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchTab = (tab: TabType) => {
    if (tab === activeTab) return;

    let hasData = false;
    if (activeTab === "suggestion") {
      hasData = suggestionText.trim().length > 0;
    } else if (activeTab === "feedback") {
      hasData = (
        feedbackPurchaseId.trim().length > 0 || 
        feedbackRating.trim().length > 0 || 
        feedbackComment.trim().length > 0 || 
        file !== null
      );
    }

    if (hasData) {
      const confirmSwitch = window.confirm("You have unsaved changes in this tab. Are you sure you want to switch? (Your current progress is saved as a draft)");
      if (!confirmSwitch) return;
    }

    setActiveTab(tab);
    setSubmitError("");
    setFileError("");
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Suggestion / Feedback</h1>
        <p style={{ color: "var(--text-muted)", marginTop: 4 }}>
          Share your suggestions or submit detailed feedback about your purchases.
        </p>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
        <button
          onClick={() => switchTab("suggestion")}
          type="button"
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            background: activeTab === "suggestion" ? "var(--gold-dim)" : "var(--glass-bg)",
            color: activeTab === "suggestion" ? "var(--text-gold)" : "var(--text-secondary)",
            border: `1px solid ${activeTab === "suggestion" ? "var(--gold)" : "var(--glass-border)"}`,
            cursor: "pointer"
          }}
        >
          <MessageSquare size={18} />
          Suggestion
        </button>
        <button
          onClick={() => switchTab("feedback")}
          type="button"
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-full)",
            fontWeight: 600,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: "all 0.2s ease",
            background: activeTab === "feedback" ? "var(--gold-dim)" : "var(--glass-bg)",
            color: activeTab === "feedback" ? "var(--text-gold)" : "var(--text-secondary)",
            border: `1px solid ${activeTab === "feedback" ? "var(--gold)" : "var(--glass-border)"}`,
            cursor: "pointer"
          }}
        >
          <Star size={18} />
          Feedback
        </button>
      </div>

      <Card className="bg-background/60 backdrop-blur-md border-border/50 shadow-sm animate-fade-in-up" style={{ padding: 32, maxWidth: 600, animationDelay: "100ms" }}>
        {isSubmitted ? (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, borderRadius: "50%", background: "rgba(16, 185, 129, 0.1)", color: "#10b981", marginBottom: 24 }}>
              <FileCheck size={32} />
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: "var(--text-primary)" }}>
              Thank You!
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: 15 }}>
              Your {activeTab} has been submitted successfully. We appreciate your input!
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn btn-ghost"
              style={{ padding: "10px 24px" }}
            >
              Submit Another
            </button>
          </div>
        ) : (
          <>
            <form 
              onSubmit={handleSuggestionSubmit} 
              style={{ display: activeTab === "suggestion" ? "block" : "none" }}
            >
              {submitError && activeTab === "suggestion" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: 20 }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: 14 }}>{submitError}</span>
                </div>
              )}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                    Comments about your purchase
                  </label>
                  <span style={{ fontSize: 12, color: suggestionText.length > MAX_TEXT_LENGTH ? "#ef4444" : "var(--text-muted)" }}>
                    {suggestionText.length} / {MAX_TEXT_LENGTH}
                  </span>
                </div>
                <textarea
                  required={activeTab === "suggestion"}
                  value={suggestionText}
                  onChange={(e) => setSuggestionText(e.target.value)}
                  className={`input ${suggestionText.length > MAX_TEXT_LENGTH ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  placeholder="What did you like or dislike? Any suggestions?"
                  style={{ 
                    minHeight: 120, 
                    resize: "vertical", 
                    width: "100%", 
                    padding: 12, 
                    borderRadius: "var(--radius-md)", 
                    border: `1px solid ${suggestionText.length > MAX_TEXT_LENGTH ? '#ef4444' : 'var(--glass-border)'}`, 
                    background: "var(--bg-elevated)", 
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
                {suggestionText.length > MAX_TEXT_LENGTH && (
                  <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                    Please keep your suggestion under {MAX_TEXT_LENGTH} characters.
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={isSubmitting || suggestionText.length > MAX_TEXT_LENGTH}
                className="btn btn-gold"
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, opacity: isSubmitting ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Suggestion
                  </>
                )}
              </button>
            </form>

            <form 
              onSubmit={handleFeedbackSubmit} 
              style={{ display: activeTab === "feedback" ? "block" : "none" }}
            >
              {submitError && activeTab === "feedback" && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: 12, borderRadius: "var(--radius-md)", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: 20 }}>
                  <AlertCircle size={18} />
                  <span style={{ fontSize: 14 }}>{submitError}</span>
                </div>
              )}
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Purchase ID
                </label>
                <input
                  type="text"
                  required={activeTab === "feedback"}
                  value={feedbackPurchaseId}
                  onChange={(e) => setFeedbackPurchaseId(e.target.value)}
                  className="input"
                  placeholder="e.g. PUR12345678"
                  style={{ width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Rating (1-5)
                </label>
                <input
                  type="number"
                  required={activeTab === "feedback"}
                  min="1"
                  max="5"
                  value={feedbackRating}
                  onChange={(e) => setFeedbackRating(e.target.value)}
                  className="input"
                  placeholder="5"
                  style={{ width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                    Comment
                  </label>
                  <span style={{ fontSize: 12, color: feedbackComment.length > MAX_TEXT_LENGTH ? "#ef4444" : "var(--text-muted)" }}>
                    {feedbackComment.length} / {MAX_TEXT_LENGTH}
                  </span>
                </div>
                <textarea
                  required={activeTab === "feedback"}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                  className={`input ${feedbackComment.length > MAX_TEXT_LENGTH ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""}`}
                  placeholder="Share your detailed experience..."
                  style={{ 
                    minHeight: 100, 
                    resize: "vertical", 
                    width: "100%", 
                    padding: 12, 
                    borderRadius: "var(--radius-md)", 
                    border: `1px solid ${feedbackComment.length > MAX_TEXT_LENGTH ? '#ef4444' : 'var(--glass-border)'}`, 
                    background: "var(--bg-elevated)", 
                    color: "var(--text-primary)",
                    outline: "none"
                  }}
                />
                {feedbackComment.length > MAX_TEXT_LENGTH && (
                  <p style={{ color: "#ef4444", fontSize: 12, marginTop: 4 }}>
                    Please keep your comment under {MAX_TEXT_LENGTH} characters.
                  </p>
                )}
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                  Upload Purchase Image
                </label>
                <div
                  style={{
                    border: `2px dashed ${fileError ? '#ef4444' : 'var(--glass-border)'}`,
                    borderRadius: "var(--radius-md)",
                    padding: 24,
                    textAlign: "center",
                    cursor: "pointer",
                    background: fileError ? "rgba(239, 68, 68, 0.05)" : "rgba(255,255,255,0.02)",
                    transition: "all 0.2s"
                  }}
                  className={`hover:border-[var(--gold)] ${!fileError ? 'hover:bg-[rgba(139,92,246,0.05)]' : ''}`}
                  onClick={() => document.getElementById("image-upload")?.click()}
                >
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg, image/png, image/webp, image/heic"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    required={activeTab === "feedback" && !file}
                  />
                  {file ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-gold)" }}>
                      <FileCheck size={32} />
                      <span style={{ fontWeight: 500, fontSize: 14 }}>{file.name}</span>
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                      <ImageIcon size={32} />
                      <span style={{ fontSize: 14, color: fileError ? "#ef4444" : "var(--text-muted)" }}>
                        Click to upload image (JPEG, PNG, HEIC)
                      </span>
                      <span style={{ fontSize: 12 }}>Max size: 5MB</span>
                    </div>
                  )}
                </div>
                {fileError && (
                  <p style={{ color: "#ef4444", fontSize: 13, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertCircle size={14} />
                    {fileError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || feedbackComment.length > MAX_TEXT_LENGTH || !!fileError}
                className="btn btn-gold"
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, opacity: (isSubmitting || feedbackComment.length > MAX_TEXT_LENGTH || fileError) ? 0.7 : 1 }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Submit Feedback
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </Card>
    </div>
  );
}
