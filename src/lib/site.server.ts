import { supabaseAdmin } from "@/integrations/supabase/client.server";

export const CV_SETTING_KEY = "cv";

export type CvInfo = {
  name: string;
  size: number;
  type: string;
  path: string;
  updatedAt: string;
};

export type PublicCv = CvInfo & { url: string };

function parseCv(value: unknown): CvInfo | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (typeof v['path'] !== "string" || !v['path']) return null;
  return {
    name: typeof v['name'] === "string" ? v['name'] : "cv.pdf",
    size: typeof v['size'] === "number" ? v['size'] : 0,
    type: typeof v['type'] === "string" ? v['type'] : "application/pdf",
    path: v['path'],
    updatedAt: typeof v['updatedAt'] === "string" ? v['updatedAt'] : new Date().toISOString(),
  };
}

export async function readCv(): Promise<CvInfo | null> {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", CV_SETTING_KEY)
    .maybeSingle();
  return parseCv(data?.value);
}

export async function readPublicCv(): Promise<PublicCv | null> {
  const cv = await readCv();
  if (!cv) return null;
  const { data, error } = await supabaseAdmin.storage
    .from("cv")
    .createSignedUrl(cv.path, 60 * 60);
  if (error || !data?.signedUrl) return null;
  return { ...cv, url: data.signedUrl };
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from("user_roles")
    .select("id")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  return Boolean(data);
}

/** The very first account that asks becomes the single site owner. */
export async function claimOwnerIfVacant(userId: string): Promise<boolean> {
  const { data: existing } = await supabaseAdmin
    .from("user_roles")
    .select("user_id")
    .eq("role", "admin")
    .limit(1);
  if (existing && existing.length > 0) {
    return existing[0]?.user_id === userId;
  }
  const { error } = await supabaseAdmin
    .from("user_roles")
    .insert({ user_id: userId, role: "admin" });
  return !error;
}

export async function requireAdmin(userId: string) {
  if (!(await isUserAdmin(userId))) throw new Error("Forbidden: admin only");
}

export async function storeCv(input: {
  name: string;
  type: string;
  base64: string;
}): Promise<PublicCv> {
  const bytes = Uint8Array.from(atob(input.base64), (c) => c.charCodeAt(0));
  const ext = input.name.includes(".") ? input.name.split(".").pop() : "pdf";
  const path = `cv-${Date.now()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("cv")
    .upload(path, bytes, { contentType: input.type || "application/pdf", upsert: true });
  if (uploadError) throw new Error(uploadError.message);

  const previous = await readCv();

  const value: CvInfo = {
    name: input.name,
    size: bytes.byteLength,
    type: input.type || "application/pdf",
    path,
    updatedAt: new Date().toISOString(),
  };

  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: CV_SETTING_KEY, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);

  if (previous?.path && previous.path !== path) {
    await supabaseAdmin.storage.from("cv").remove([previous.path]);
  }

  const publicCv = await readPublicCv();
  if (!publicCv) throw new Error("Could not create a download link");
  return publicCv;
}

export async function clearCv(): Promise<void> {
  const previous = await readCv();
  if (previous?.path) await supabaseAdmin.storage.from("cv").remove([previous.path]);
  await supabaseAdmin.from("site_settings").delete().eq("key", CV_SETTING_KEY);
}
