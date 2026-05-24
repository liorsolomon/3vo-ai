"use client";

import { useState, useCallback, useRef } from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PICKER_API_KEY ?? "";
const SCOPE = "https://www.googleapis.com/auth/drive.file";

// Text-extractable MIME types via Drive export API
const GOOGLE_DOC_MIMES = new Set([
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.presentation",
  "application/vnd.google-apps.spreadsheet",
]);
const PLAIN_TEXT_MIMES = new Set([
  "text/plain",
  "text/markdown",
  "text/csv",
  "application/json",
]);

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    gapi: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
    __gapiLoaded?: boolean;
    __gsiLoaded?: boolean;
  }
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

async function loadPicker(): Promise<void> {
  await loadScript("https://apis.google.com/js/api.js");
  await new Promise<void>((resolve) => window.gapi.load("picker", resolve));
}

async function loadGsi(): Promise<void> {
  await loadScript("https://accounts.google.com/gsi/client");
}

async function getAccessToken(): Promise<string> {
  await loadGsi();
  return new Promise((resolve, reject) => {
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (resp: { access_token?: string; error?: string }) => {
        if (resp.access_token) resolve(resp.access_token);
        else reject(new Error(resp.error ?? "OAuth failed"));
      },
    });
    client.requestAccessToken({ prompt: "consent" });
  });
}

async function readFileContent(fileId: string, mimeType: string, token: string): Promise<string> {
  const headers = { Authorization: `Bearer ${token}` };

  if (GOOGLE_DOC_MIMES.has(mimeType)) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=text/plain`,
      { headers }
    );
    if (!res.ok) throw new Error(`Export failed: ${res.status}`);
    return res.text();
  }

  if (PLAIN_TEXT_MIMES.has(mimeType) || mimeType.startsWith("text/")) {
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      { headers }
    );
    if (!res.ok) throw new Error(`Download failed: ${res.status}`);
    return res.text();
  }

  throw new Error(`Unsupported file type: ${mimeType}. Import Google Docs or plain text files.`);
}

interface Props {
  fieldName: string;
  disabled?: boolean;
  onImport: (fieldName: string, text: string) => void;
}

export default function GoogleDrivePicker({ fieldName, disabled, onImport }: Props) {
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const tokenRef = useRef<string>("");

  const handleClick = useCallback(async () => {
    if (!CLIENT_ID || !API_KEY) {
      setErrorMsg("Drive import is not configured.");
      setState("error");
      return;
    }

    setState("loading");
    setErrorMsg("");

    try {
      const [token] = await Promise.all([getAccessToken(), loadPicker()]);
      tokenRef.current = token;

      await new Promise<void>((resolve, reject) => {
        const docsView = new window.google.picker.DocsView()
          .setIncludeFolders(false)
          .setMimeTypes(
            [
              ...Array.from(GOOGLE_DOC_MIMES),
              ...Array.from(PLAIN_TEXT_MIMES),
              "text/*",
            ].join(",")
          );

        const picker = new window.google.picker.PickerBuilder()
          .setAppId(CLIENT_ID.split("-")[0])
          .setOAuthToken(token)
          .setDeveloperKey(API_KEY)
          .addView(docsView)
          .enableFeature(window.google.picker.Feature.MULTISELECT_ENABLED)
          .setCallback(
            async (data: {
              action: string;
              docs?: Array<{ id: string; mimeType: string; name: string }>;
            }) => {
              if (data.action === window.google.picker.Action.CANCEL) {
                setState("idle");
                resolve();
                return;
              }
              if (data.action !== window.google.picker.Action.PICKED) return;

              try {
                const docs = data.docs ?? [];
                const texts = await Promise.all(
                  docs.map((doc) => readFileContent(doc.id, doc.mimeType, tokenRef.current))
                );
                onImport(fieldName, texts.join("\n\n---\n\n"));
                setState("idle");
                resolve();
              } catch (err) {
                reject(err);
              }
            }
          )
          .build();

        picker.setVisible(true);
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Import failed";
      setErrorMsg(msg);
      setState("error");
    }
  }, [fieldName, onImport]);

  if (!CLIENT_ID || !API_KEY) return null;

  return (
    <div className="flex items-center gap-3 mt-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled || state === "loading"}
        className="text-[10px] tracking-widest text-[#E8E8E8]/30 hover:text-[#00FF85]/70 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ fontFamily: "var(--font-share-tech-mono)" }}
      >
        {state === "loading" ? "LOADING…" : "↗ IMPORT FROM DRIVE"}
      </button>
      {state === "error" && (
        <span
          className="text-[10px] tracking-widest text-[#FF4444]/70"
          style={{ fontFamily: "var(--font-share-tech-mono)" }}
        >
          {errorMsg}
        </span>
      )}
    </div>
  );
}
