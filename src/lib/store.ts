// src/lib/store.ts - Stable Frontend Store (SAFE FOR VERCEL)

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

// ─────────────────────────────
// Storage Keys
// ─────────────────────────────

const USER_KEY = "lunadx_current_user";
const PATIENTS_KEY = "lunadx_patients";
const SCANS_KEY = "lunadx_scans";

// ─────────────────────────────
// Auth
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
// Permissions
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

export function saveScan(scan: any) {
  const scans = getScans();

  const newScan = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...scan,
  };

  scans.push(newScan);
  localStorage.setItem(SCANS_KEY, JSON.stringify(scans));

  return newScan;
}

// ─────────────────────────────
// Organization
// ─────────────────────────────

export function getOrganization() {
  return {
    id: "org-1",
    name: "LunaDX Demo Hospital",
    location: "Demo",
    plan: "trial",
  };
}

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
// AI (mock safe fallback)
// ─────────────────────────────

export async function analyzeXray() {
  return {
    pneumonia_probability: 0,
    tb_probability: 0,
    heatmap_overlay_url: null,
    ai_summary: "Frontend mock mode - backend not connected",
  };
}

export function simulateAI() {
  return {
    tbRisk: 20,
    pneumoniaRisk: 25,
    lungOpacityRisk: 10,
    pleuralEffusionRisk: 5,
    lungNodulesRisk: 3,
    findings: ["No acute abnormality detected"],
    suggestions: ["Clinical correlation recommended"],
  };
}

export function updateScanNotes(scanId: string, notes: string) {
  const scans = JSON.parse(localStorage.getItem("lunadx_scans") || "[]");

  const updated = scans.map((s: any) =>
    s.id === scanId ? { ...s, notes } : s
  );

  localStorage.setItem("lunadx_scans", JSON.stringify(updated));
  return true;
}
