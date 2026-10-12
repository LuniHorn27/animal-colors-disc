/* =====================================================================
   公開設定：建好帳號後填入（詳見「帳號設定步驟.md」）
   這裡只能放「公開」的值。絕對不要把 Supabase 的 service_role 金鑰、
   Turnstile 的 Secret Key、Google 的 Client Secret 放進這個檔案。
   三個欄位都留空時，網頁以「原型模式」運作（資料只存在瀏覽器）。
   ===================================================================== */
window.DISC_CONFIG = {
  // Supabase → Project Settings → API → Project URL，例如 https://abcdefgh.supabase.co
  supabaseUrl: '',
  // Supabase → Project Settings → API → Project API keys → anon / public
  supabaseAnonKey: '',
  // Cloudflare → Turnstile → 你的網站 → Site Key
  turnstileSiteKey: '',
};
