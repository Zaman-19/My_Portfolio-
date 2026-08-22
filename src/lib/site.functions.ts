import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getPublicCv = createServerFn({ method: "GET" }).handler(async () => {
  const { readPublicCv } = await import("./site.server");
  return await readPublicCv();
});

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { claimOwnerIfVacant, isUserAdmin } = await import("./site.server");
    const claimed = await claimOwnerIfVacant(context.userId);
    return { isAdmin: claimed || (await isUserAdmin(context.userId)) };
  });

export const createCvUploadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string }) => data)
  .handler(async ({ data, context }) => {
    const { requireAdmin, makeCvUploadUrl } = await import("./site.server");
    await requireAdmin(context.userId);
    return await makeCvUploadUrl(data.name);
  });

export const finalizeCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { path: string; name: string; type: string; size: number }) => data)
  .handler(async ({ data, context }) => {
    const { requireAdmin, saveCvRecord } = await import("./site.server");
    await requireAdmin(context.userId);
    return await saveCvRecord(data);
  });

export const uploadCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { name: string; type: string; base64: string }) => data)
  .handler(async ({ data, context }) => {
    const { requireAdmin, storeCv } = await import("./site.server");
    await requireAdmin(context.userId);
    return await storeCv(data);
  });


export const removeCv = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { requireAdmin, clearCv } = await import("./site.server");
    await requireAdmin(context.userId);
    await clearCv();
    return { ok: true as const };
  });
