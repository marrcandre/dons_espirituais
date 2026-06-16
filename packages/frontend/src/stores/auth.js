import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../services/supabase.js";
import { runSupabaseQuery } from "../services/supabaseQuery.js";
import router from "../router";

const AUTH_TIMEOUT_MS = 8000;

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const profile = ref(null);
  const initialized = ref(false);

  let initPromise = null;
  let authSubscription = null;

  const isAdmin = computed(() => profile.value?.role === "admin");
  const isSupervisor = computed(() => profile.value?.role === "supervisor");

  const canAccessAdminPanel = computed(() =>
    ["admin", "supervisor"].includes(profile.value?.role),
  );

  async function init() {
    if (initialized.value) return;
    if (initPromise) return initPromise;

    initPromise = (async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) throw error;

        const session = data.session;
        user.value = session?.user ?? null;

        if (session?.user) {
          await loadProfile(session.user.id);
        }

        // evita múltiplos listeners
        if (!authSubscription) {
          const { data } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
              user.value = session?.user ?? null;

              if (session?.user) {
                loadProfile(session.user.id).catch((err) => {
                  console.error("Erro ao carregar perfil:", err);
                });
              } else {
                profile.value = null;
              }
            },
          );

          authSubscription = data.subscription;
        }

        initialized.value = true;
      } catch (err) {
        console.error("Erro ao inicializar autenticação:", err);
        user.value = null;
        profile.value = null;
        initialized.value = true;
      } finally {
        initPromise = null;
      }
    })();

    return initPromise;
  }

  async function loadProfile(userId) {
    let tries = 0;
    let data = null;
    let error = null;

    while (tries < 3) {
      const result = await runSupabaseQuery(
        supabase.from("users").select("*").eq("id", userId).maybeSingle(),
        AUTH_TIMEOUT_MS,
      );

      data = result.data;
      error = result.error;

      if (data) break;
      await new Promise((r) => setTimeout(r, 300));
      tries++;
    }

    if (error) throw error;
    profile.value = data ?? null;
  }

  async function signInWithGoogle() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // redirectTo: `${window.location.origin}/`,
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();

    user.value = null;
    profile.value = null;

    router.push("/login");
  }

  return {
    user,
    profile,
    isAdmin,
    isSupervisor,
    canAccessAdminPanel,
    initialized,
    init,
    signInWithGoogle,
    signOut,
  };
});
