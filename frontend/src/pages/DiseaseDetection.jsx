import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api/client";
import {
  Scan,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  FileImage,
  RefreshCw,
  Camera,
  X,
  History,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const formatDiseaseName = (rawName) => {
  if (!rawName) return "";
  let str = String(rawName).trim();

  if (str.includes("___")) {
    const parts = str.split("___");
    str = parts[parts.length - 1];
  }

  let cleanDisease = str.replace(/_/g, " ").replace(/\s+/g, " ").trim();

  if (cleanDisease.toLowerCase() === "healthy") {
    return "Healthy";
  }

  return cleanDisease
    .split(" ")
    .map((w) => {
      if (!w) return "";
      if (w.startsWith("(") && w.length > 1) {
        return "(" + w.charAt(1).toUpperCase() + w.slice(2).toLowerCase();
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(" ");
};

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [expandedLogId, setExpandedLogId] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const fileInputRef = useRef(null);

  const fetchHistory = async () => {
    try {
      const data = await api.getDiseaseHistory();
      if (data && Array.isArray(data.history)) {
        setHistoryLogs(data.history);
      }
    } catch (err) {
      console.error("Failed to load disease history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const clearSelection = () => {
    setFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setResult(null);
    setError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit. Please upload a smaller image.");
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const openCamera = async () => {
    setError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = mediaStream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 150);
    } catch {
      setError(
        "Unable to access live camera. Please grant camera permission or select a photo file.",
      );
    }
  };

  const closeCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const capturedFile = new File([blob], `leaf_scan_${Date.now()}.jpg`, {
          type: "image/jpeg",
        });
        handleFileSelect(capturedFile);
        closeCamera();
      }
    }, "image/jpeg");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    try {
      const data = await api.detectDisease(formData);
      if (data.error) throw new Error(data.error);
      setResult(data);
      fetchHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      <div className="page-header">
        <div className="page-badge">
          <Scan size={14} />
          <span>AI Plant Disease Classifier</span>
        </div>
        <h1 className="page-title">{t("disease.title")}</h1>
        <p className="page-subtitle">
          Take a live leaf photograph or upload an image to identify crop
          diseases and receive recommended treatment.
        </p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          <div
            className={`dropzone ${preview ? "active" : ""} ${isDragging ? "dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              position: "relative",
              cursor: "pointer",
              padding: "32px 20px",
              border: isDragging ? "2px dashed var(--primary-500)" : undefined,
              backgroundColor: isDragging
                ? "rgba(16, 185, 129, 0.05)"
                : undefined,
              transition: "all 0.2s ease-in-out",
            }}
          >
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {preview ? (
              <div
                style={{ position: "relative" }}
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={preview}
                  alt="Crop preview"
                  style={{
                    maxHeight: "260px",
                    maxWidth: "100%",
                    borderRadius: "var(--radius-sm)",
                    objectFit: "cover",
                    boxShadow: "var(--shadow-md)",
                  }}
                />
                <p
                  style={{
                    marginTop: "12px",
                    fontSize: "14px",
                    color: "var(--text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                  }}
                >
                  <FileImage size={16} />
                  <span>{file.name}</span>
                </p>
                <div
                  style={{
                    marginTop: "14px",
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "10px",
                  }}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    style={{
                      padding: "6px 14px",
                      fontSize: "13px",
                      width: "auto",
                    }}
                  >
                    <RefreshCw size={14} />
                    <span>Choose / Select File</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCamera();
                    }}
                    style={{
                      padding: "6px 14px",
                      fontSize: "13px",
                      width: "auto",
                    }}
                  >
                    <Camera size={14} style={{ color: "var(--primary-500)" }} />
                    <span>Scan with Camera</span>
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSelection();
                    }}
                    style={{
                      padding: "6px 14px",
                      fontSize: "13px",
                      width: "auto",
                      color: "var(--accent-red, #ef4444)",
                    }}
                  >
                    <X size={14} />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "16px",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "50%",
                    background: "rgba(16, 185, 129, 0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--primary-500)",
                  }}
                >
                  <UploadCloud size={28} />
                </div>
                <div>
                  <p
                    style={{
                      fontWeight: 700,
                      fontSize: "16px",
                      marginBottom: "4px",
                    }}
                  >
                    Click to select or drag & drop leaf image here
                  </p>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-muted)",
                      marginBottom: "12px",
                    }}
                  >
                    Supports PNG, JPG, JPEG, WEBP (up to 10 MB)
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "4px",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      openCamera();
                    }}
                    style={{
                      padding: "8px 18px",
                      fontSize: "13.5px",
                      width: "auto",
                    }}
                  >
                    <Camera size={16} style={{ color: "var(--primary-500)" }} />
                    <span>Scan with Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !file}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="spinner" />
                  <span>{t("disease.analyzing")}</span>
                </>
              ) : (
                <>
                  <Scan size={18} />
                  <span>{t("disease.upload_button")}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {cameraActive && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(0, 0, 0, 0.85)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
            }}
          >
            <div
              className="glass-card"
              style={{
                width: "100%",
                maxWidth: "520px",
                padding: "20px",
                position: "relative",
                background: "var(--bg-app)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 700,
                  }}
                >
                  <Camera size={18} style={{ color: "var(--primary-500)" }} />
                  <span>Live Leaf Scanner</span>
                </div>
                <button
                  type="button"
                  onClick={closeCamera}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text-main)",
                    cursor: "pointer",
                  }}
                >
                  <X size={22} />
                </button>
              </div>

              <div
                style={{
                  position: "relative",
                  borderRadius: "var(--radius-md)",
                  overflow: "hidden",
                  background: "#000000",
                }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "100%",
                    maxHeight: "360px",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: "15%",
                    border: "2px dashed var(--primary-500)",
                    borderRadius: "12px",
                    pointerEvents: "none",
                    boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.35)",
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={capturePhoto}
                >
                  <Camera size={18} />
                  <span>Capture & Analyze Leaf</span>
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeCamera}
                  style={{ width: "auto" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Analysis Failed</strong>
              <p style={{ fontSize: "13px", marginTop: "2px" }}>{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div
            style={{
              marginTop: "32px",
              paddingTop: "24px",
              borderTop: "1px solid var(--border-color)",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <h3 style={{ fontSize: "20px" }}>Diagnosis Summary</h3>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Identified Condition
                </p>
                <p
                  style={{
                    fontSize: "17px",
                    fontWeight: 700,
                    color: "var(--primary-500)",
                  }}
                >
                  {formatDiseaseName(result.class_name || result.prediction)}
                </p>
              </div>

              <div
                style={{
                  padding: "16px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    marginBottom: "4px",
                  }}
                >
                  Confidence Score
                </p>
                <p style={{ fontSize: "17px", fontWeight: 700 }}>
                  {result.confidence_percent ||
                    (result.confidence * 100).toFixed(1)}
                  %
                </p>
              </div>
            </div>

            {result.top_3 && result.top_3.length > 0 && (
              <div
                style={{
                  marginBottom: "24px",
                  padding: "16px 20px",
                  borderRadius: "var(--radius-sm)",
                  background: "var(--bg-input)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <p
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--text-muted)",
                    marginBottom: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Top Candidate Diagnoses
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {result.top_3.map((item, idx) => (
                    <div key={idx}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "13px",
                          fontWeight: idx === 0 ? 700 : 500,
                          marginBottom: "4px",
                        }}
                      >
                        <span style={{ color: idx === 0 ? "var(--primary-500)" : "var(--text-main)" }}>
                          {formatDiseaseName(item.label)}
                        </span>
                        <span>{item.confidence_percent}%</span>
                      </div>
                      <div
                        style={{
                          height: "6px",
                          width: "100%",
                          borderRadius: "4px",
                          background: "var(--bg-app)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${Math.max(item.confidence_percent, 2)}%`,
                            background: idx === 0 ? "var(--primary-500)" : "rgba(16, 185, 129, 0.4)",
                            borderRadius: "4px",
                            transition: "width 0.3s ease",
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(result.treatment || result.recommended_action) && (
              <div
                style={{
                  padding: "20px",
                  borderRadius: "var(--radius-sm)",
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "8px",
                    fontWeight: 700,
                    color: "var(--primary-500)",
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>Recommended Treatment Action Plan</span>
                </div>
                <p
                  style={{
                    fontSize: "14.5px",
                    color: "var(--text-main)",
                    lineHeight: 1.6,
                  }}
                >
                  {result.treatment || result.recommended_action}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {historyLogs.length > 0 && (
        <div
          className="glass-card"
          style={{
            marginTop: "32px",
            padding: "24px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "20px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary-500)",
                }}
              >
                <History size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: 700, margin: 0 }}>
                  Recent Scan Logs
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    color: "var(--text-muted)",
                    margin: 0,
                  }}
                >
                  Persisted records from{" "}
                  <code style={{ color: "var(--primary-400)" }}>
                    disease_history
                  </code>
                </p>
              </div>
            </div>
            <span
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "var(--bg-input)",
                border: "1px solid var(--border-color)",
                color: "var(--text-muted)",
              }}
            >
              {historyLogs.length} Saved Records
            </span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13.5px",
              }}
            >
              <thead>
                <tr
                  style={{
                    borderBottom: "1px solid var(--border-color)",
                    color: "var(--text-muted)",
                    textAlign: "left",
                  }}
                >
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>
                    File
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>
                    Diagnosis Result
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>
                    Confidence
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 600 }}>
                    Recorded Date
                  </th>
                  <th style={{ padding: "10px 12px", fontWeight: 600, textAlign: "right" }}>
                    Action Plan
                  </th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.map((log) => {
                  const isExpanded = expandedLogId === log.id;
                  return (
                    <React.Fragment key={log.id}>
                      <tr
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        style={{
                          borderBottom: isExpanded ? "none" : "1px solid var(--border-color)",
                          cursor: "pointer",
                          transition: "background-color 0.15s ease",
                          backgroundColor: isExpanded ? "rgba(16, 185, 129, 0.06)" : undefined,
                        }}
                      >
                        <td
                          style={{
                            padding: "12px",
                            fontWeight: 600,
                            color: "var(--text-main)",
                          }}
                        >
                          {log.filename || "leaf_scan.jpg"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            color: "var(--primary-500)",
                            fontWeight: 600,
                          }}
                        >
                          {formatDiseaseName(log.prediction)}
                        </td>
                        <td style={{ padding: "12px", fontWeight: 600 }}>
                          {log.confidence_percent != null
                            ? `${Number(log.confidence_percent).toFixed(1)}%`
                            : "N/A"}
                        </td>
                        <td
                          style={{
                            padding: "12px",
                            color: "var(--text-muted)",
                            fontSize: "12.5px",
                          }}
                        >
                          {log.created_at
                            ? new Date(log.created_at).toLocaleString()
                            : "Just now"}
                        </td>
                        <td style={{ padding: "12px", textAlign: "right" }}>
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedLogId(isExpanded ? null : log.id);
                            }}
                            style={{
                              padding: "4px 10px",
                              fontSize: "12px",
                              width: "auto",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <span>{isExpanded ? "Hide" : "View"}</span>
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                          </button>
                        </td>
                      </tr>

                      {isExpanded && (
                        <tr
                          style={{
                            borderBottom: "1px solid var(--border-color)",
                            backgroundColor: "rgba(16, 185, 129, 0.04)",
                          }}
                        >
                          <td colSpan={5} style={{ padding: "14px 16px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: "10px",
                              }}
                            >
                              <CheckCircle2
                                size={18}
                                style={{
                                  color: "var(--primary-500)",
                                  marginTop: "2px",
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <strong
                                  style={{
                                    color: "var(--primary-400)",
                                    fontSize: "13px",
                                    display: "block",
                                    marginBottom: "4px",
                                  }}
                                >
                                  Recommended Treatment Action Plan:
                                </strong>
                                <p
                                  style={{
                                    margin: 0,
                                    fontSize: "13.5px",
                                    color: "var(--text-main)",
                                    lineHeight: 1.55,
                                  }}
                                >
                                  {log.recommended_action ||
                                    "Consult a local agronomist or agricultural extension service for detailed treatment recommendations."}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
