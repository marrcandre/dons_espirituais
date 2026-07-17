import { defineStore } from "pinia";
import { ref, computed } from "vue";
import * as authRepository from "../repositories/authRepository.js";
import { getUserProfile } from "../application/auth/user-profile.js";
import router from "../router";

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
        const session = await authRepository.getSession();
        user.value = session?.user ?? null;

        if (session?.user) {
          profile.value = await getUserProfile()
        }

        if (!authSubscription) {
          authSubscription = authRepository.onAuthStateChange(
            async (_event, session) => {
              user.value = session?.user ?? null;

              if (session?.user) {
                getUserProfile()
                  .then((p) => { profile.value = p })
                  .catch((err) => {
                    console.error("Erro ao carregar perfil:", err);
                  });
              } else {
                profile.value = null;
              }
            },
          );
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

  async function signInWithGoogle() {
    await authRepository.signInWithGoogle()
  }

  async function signOut() {
    await authRepository.signOut()

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
