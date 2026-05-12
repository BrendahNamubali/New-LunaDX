// LunaDX Store (Stable Clean Version)

const BACKEND = "/api";

// ─────────────────────────────
// Types
// ─────────────────────────────

export type UserRole = "Admin" | "Radiologist" | "Clinician";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  sex?: string;
  createdAt: string;
}

export interface Scan {
  id: string;
  patientId: string;
  createdAt: string;
  result?: any;
}

export interface AIAnalysisResponse {
  pneumonia_probability: number;
  tb_probability: number;
  heatmap_overlay_url: string | null;
  ai_summary: string;
}

// ─────────────────────────────
// Keys
// ─────────────────────────────

const USER_KEY = "lunadx_current_user";
const PATIENTS_KEY = "lunadx_patients";
const SCANS_KEY = "lunadx_scans";

// ─────────────────────────────
// Auth (demo-safe)
// ─────────────────────────────

export function getCurrentUser(): User {
  const raw = localStorage.getItem(USER_KEY);

  if (raw) return JSON.parse(raw);

  return {
    id: "1",
    name: "Demo Admin",
    email: "admin@lunadx.com",
    role: "Admin",
  };
}

export function login(email: string): User {
  const user: User = {
    id: "1",
    name: "Demo User",
    email,
    role: "Admin",
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  localStorage.removeItem(USER_KEY);
}

// ─────────────────────────────
// Patients (FIXED EXPORTS)
// ─────────────────────────────

export function getPatients(): Patient[] {
  return JSON.parse(localStorage.getItem(PATIENTS_KEY) || "[]");
}

export function savePatient(patient: Patient) {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  return patient;
}

export function deletePatient(id: string) {
  const patients = getPatients();
  const updated = patients.filter((p) => p.id !== id);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(updated));
}

// ─────────────────────────────
// AI ANALYSIS (CLEAN)
// ─────────────────────────────

export async function analyzeXray(imageDataUrl: string): Promise<AIAnalysisResponse> {
  try {
    const HF_TOKEN = import.meta.env.VITE_HF_TOKEN;

    const response = await fetch(
      "https://api-inference.huggingface.co/models/keremberke/chest-xray-classification",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: imageDataUrl,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("HF error:", err);
      throw new Error("Hugging Face request failed");
    }

    const result = await response.json();

    // Normalize Hugging Face output
    const top = Array.isArray(result) ? result[0] : result;

    return {
      pneumonia_probability: top?.label === "pneumonia" ? top?.score || 0 : 0,
      tb_probability: top?.label === "tuberculosis" ? top?.score || 0 : 0,
      heatmap_overlay_url: null,
      ai_summary: `Prediction: ${top?.label || "unknown"} (${Math.round((top?.score || 0) * 100)}%)`,
    };
  } catch (err) {
    console.error("AI failed:", err);

    return {
      pneumonia_probability: 0,
      tb_probability: 0,
      heatmap_overlay_url: null,
      ai_summary: "AI analysis failed",
    };
  }
}
// ─────────────────────────────
// SCANS (MISSING EXPORTS FIX)
// ─────────────────────────────

export function getScans(): Scan[] {
  return JSON.parse(localStorage.getItem(SCANS_KEY) || "[]");
}

export function getScanUsage() {
  const scans = getScans();
  const limit = 50;

  return {
    used: scans.length,
    total: limit,
    remaining: Math.max(limit - scans.length, 0),
  };
}

// ─────────────────────────────

export function canUploadScans(role?: UserRole) {
  return role === "Admin" || role === "Radiologist";
}
