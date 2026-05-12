// src/lib/store.ts - Stable Frontend Store (No Backend Dependencies)

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

// ─────────────────────────────
// Auth (simple demo mode)
// ─────────────────────────────

const USER_KEY = "lunadx_current_user";
const PATIENTS_KEY = "lunadx_patients";
const SCANS_KEY = "lunadx_scans";

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
// Permissions (IMPORTANT - used by sidebar)
// ─────────────────────────────

export function canUploadScans(role?: UserRole) {
  return role === "Admin" || role === "Radiologist";
}

export function canManageOrganization(role?: UserRole) {
  return role === "Admin";
}

// ─────────────────────────────
// Patients
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
// Scans
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
// Organization (demo)
// ─────────────────────────────

export function createOrganization(data: {
  name: string;
  location: string;
  adminEmail: string;
  adminName: string;
  password: string;
}) {
  const user: User = {
    id: "1",
    name: data.adminName,
    email: data.adminEmail,
    role: "Admin",
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));

  return {
    org: {
      id: "org-1",
      name: data.name,
      location: data.location,
    },
    user,
  };
}

// ─────────────────────────────
// AI (placeholder safe fallback)
// ─────────────────────────────

export async function analyzeXray(imageDataUrl: string) {
  return {
    pneumonia_probability: 0,
    tb_probability: 0,
    heatmap_overlay_url: null,
    ai_summary: "Backend not connected (frontend-only mode)",
  };
}

export function simulateAI() {
  const tbRisk = Math.round(Math.random() * 40 + 5);
  const pneumoniaRisk = Math.round(Math.random() * 50 + 10);
  const lungOpacityRisk = Math.round(Math.random() * 30 + 5);
  const pleuralEffusionRisk = Math.round(Math.random() * 20 + 2);
  const lungNodulesRisk = Math.round(Math.random() * 15 + 1);

  return {
    tbRisk,
    pneumoniaRisk,
    lungOpacityRisk,
    pleuralEffusionRisk,
    lungNodulesRisk,
    findings: [
      "No obvious acute consolidation",
      "Lung fields appear largely clear",
      "No large pleural effusion detected",
    ],
    suggestions: [
      "Correlate clinically",
      "Consider follow-up imaging if symptoms persist",
    ],
  };
}

// ─────────────────────────────
// Scans (required by UploadPage)
// ─────────────────────────────

export function saveScan(scan: any) {
  const SCANS_KEY = "lunadx_scans";

  const scans = JSON.parse(localStorage.getItem(SCANS_KEY) || "[]");

  const newScan = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...scan,
  };

  scans.push(newScan);
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans));

  return newScan;
}
