// src/lib/store.ts - Stable Frontend Store (SAFE FOR VERCEL)

const safeLocalStorage = {
  get(key: string) {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(key);
  },
  set(key: string, value: string) {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, value);
  },
  remove(key: string) {
    if (typeof window === "undefined") return;
    localStorage.removeItem(key);
  }
};

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
  const raw = safeLocalStorage.get(USER_KEY);

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      // corrupted storage fallback
    }
  }

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

  safeLocalStorage.set(USER_KEY, JSON.stringify(user));
  return user;
}

export function logout() {
  safeLocalStorage.remove(USER_KEY);
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
  return JSON.parse(safeLocalStorage.get(PATIENTS_KEY) || "[]");
}

export function savePatient(patient: Patient) {
  const patients = getPatients();
  patients.push(patient);
  safeLocalStorage.set(PATIENTS_KEY, JSON.stringify(patients));
  return patient;
}

export function deletePatient(id: string) {
  const patients = getPatients();
  const updated = patients.filter((p) => p.id !== id);
  safeLocalStorage.set(PATIENTS_KEY, JSON.stringify(updated));
}

// ─────────────────────────────
// Scans
// ─────────────────────────────

export function getScans(): Scan[] {
  return JSON.parse(safeLocalStorage.get(SCANS_KEY) || "[]");
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
  const scans = JSON.parse(safeLocalStorage.get(SCANS_KEY) || "[]");

  const newScan = {
    id: crypto?.randomUUID?.() || Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    ...scan,
  };

  scans.push(newScan);
  safeLocalStorage.set(SCANS_KEY, JSON.stringify(scans));

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

  safeLocalStorage.set(USER_KEY, JSON.stringify(user));

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
  const scans = JSON.parse(safeLocalStorage.get("lunadx_scans") || "[]");

  const updated = scans.map((s: any) =>
    s.id === scanId ? { ...s, notes } : s
  );

  safeLocalStorage.set("lunadx_scans", JSON.stringify(updated));
  return true;
}
