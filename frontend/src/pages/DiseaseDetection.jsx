import { useState, useRef } from "react";
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
} from "lucide-react";

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const handleFileSelect = (selectedFile) => {
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError("");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const openCamera = async () => {
    setError("");
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      streamRef.current = mediaStream;
      setCameraActive(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 150);
    } catch {
      setError("Unable to access live camera. Please grant camera permission or select a photo file.");
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "780px", margin: "0 auto" }}>
      {/* Header Banner */}
      <div className="page-header">
        <div className="page-badge">
          <Scan size={14} />
          <span>MobileNetV2 Vision Classifier</span>
        </div>
        <h1 className="page-title">{t("disease.title")}</h1>
        <p className="page-subtitle">
          Take a live leaf photograph or upload an image to identify crop diseases and receive recommended treatment.
        </p>
      </div>

      <div className="glass-card">
        <form onSubmit={handleSubmit}>
          {/* Dropzone Container */}
          <div
            className={`dropzone ${preview ? "active" : ""}`}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{ position: "relative", cursor: "pointer", padding: "32px 20px" }}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileSelect(e.target.files[0])}
            />

            {preview ? (
              <div style={{ position: "relative" }}>
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
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
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
                  <p style={{ fontWeight: 700, fontSize: "16px", marginBottom: "4px" }}>
                    Click to select or drag & drop leaf image here
                  </p>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px" }}>
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
                    onClick={openCamera}
                    style={{ padding: "8px 18px", fontSize: "13.5px", width: "auto" }}
                  >
                    <Camera size={16} style={{ color: "var(--primary-500)" }} />
                    <span>Scan with Camera</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: "24px" }}>
            <button type="submit" className="btn-primary" disabled={loading || !file}>
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

        {/* Live Camera Scanner Modal Overlay */}
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
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

              {/* Live Video Feed */}
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
                {/* Viewfinder Target Box Overlay */}
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
                <button type="button" className="btn-primary" onClick={capturePhoto}>
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

        {/* Error Alert */}
        {error && (
          <div className="alert-box alert-error">
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <strong>Analysis Failed</strong>
              <p style={{ fontSize: "13px", marginTop: "2px" }}>{error}</p>
            </div>
          </div>
        )}

        {/* Prediction Results */}
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
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "4px 10px",
                  borderRadius: "var(--radius-full)",
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--primary-500)",
                }}
              >
                Source: {result.source}
              </span>
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
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Identified Condition
                </p>
                <p style={{ fontSize: "17px", fontWeight: 700, color: "var(--primary-500)" }}>
                  {result.class_name || result.prediction}
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
                <p style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "4px" }}>
                  Confidence Score
                </p>
                <p style={{ fontSize: "17px", fontWeight: 700 }}>
                  {result.confidence_percent || (result.confidence * 100).toFixed(1)}%
                </p>
              </div>
            </div>

            {/* Treatment Guidance */}
            {result.treatment && (
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
                <p style={{ fontSize: "14.5px", color: "var(--text-main)", lineHeight: 1.6 }}>
                  {result.treatment}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
