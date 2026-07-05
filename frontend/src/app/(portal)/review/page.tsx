"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import { MessageSquare, Star, Image as ImageIcon, Send, FileCheck } from "lucide-react";

type TabType = "suggestion" | "feedback";

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>("suggestion");
  
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "suggestion" || tab === "feedback") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "image/png") {
      setFile(selected);
    } else {
      alert("Please upload a valid PNG file.");
    }
  };

  const handleSuggestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Suggestion submitted successfully!");
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Feedback submitted successfully!");
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
          onClick={() => setActiveTab("suggestion")}
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
          onClick={() => setActiveTab("feedback")}
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

      <GlassCard className="animate-fade-in-up" style={{ padding: 32, maxWidth: 600, animationDelay: "100ms" }}>
        {activeTab === "suggestion" ? (
          <form onSubmit={handleSuggestionSubmit}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                Comments about your purchase
              </label>
              <textarea
                required
                className="input"
                placeholder="What did you like or dislike? Any suggestions?"
                style={{ minHeight: 120, resize: "vertical", width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              <Send size={18} />
              Submit Suggestion
            </button>
          </form>
        ) : (
          <form onSubmit={handleFeedbackSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                Purchase ID
              </label>
              <input
                type="text"
                required
                className="input"
                placeholder="e.g. PUR12345678"
                style={{ width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                Rating (1-5)
              </label>
              <input
                type="number"
                required
                min="1"
                max="5"
                className="input"
                placeholder="5"
                style={{ width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                Comment
              </label>
              <textarea
                required
                className="input"
                placeholder="Share your detailed experience..."
                style={{ minHeight: 100, resize: "vertical", width: "100%", padding: 12, borderRadius: "var(--radius-md)", border: "1px solid var(--glass-border)", background: "var(--bg-elevated)", color: "var(--text-primary)" }}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: "block", marginBottom: 8, fontWeight: 600, color: "var(--text-secondary)" }}>
                Upload Purchase Image (PNG only)
              </label>
              <div
                style={{
                  border: "2px dashed var(--glass-border)",
                  borderRadius: "var(--radius-md)",
                  padding: 24,
                  textAlign: "center",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.02)",
                  transition: "all 0.2s"
                }}
                className="hover:border-[var(--gold)] hover:bg-[rgba(139,92,246,0.05)]"
                onClick={() => document.getElementById("png-upload")?.click()}
              >
                <input
                  id="png-upload"
                  type="file"
                  accept=".png"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  required={!file}
                />
                {file ? (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-gold)" }}>
                    <FileCheck size={32} />
                    <span style={{ fontWeight: 500, fontSize: 14 }}>{file.name}</span>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "var(--text-muted)" }}>
                    <ImageIcon size={32} />
                    <span style={{ fontSize: 14 }}>Click to upload PNG</span>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-gold"
              style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}
            >
              <Send size={18} />
              Submit Feedback
            </button>
          </form>
        )}
      </GlassCard>
    </div>
  );
}
