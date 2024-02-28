import { ref, onMounted } from "vue";

const regexp = /@version\s+(.+)\n/;

const getNewVersion = () => {
  return fetch(`${import.meta.env.VITE_PLUGIN_META_URL}?t=${Date.now()}`)
    .then((res) => {
      if (res.ok) {
        return res.text();
      } else {
        return Promise.reject(new Error("getNewVersion error"));
      }
    })
    .then((res) => regexp.exec(res)?.[1] || "");
};

const useVersion = () => {
  const currentVersion = import.meta.env.VITE_VERSION;
  const newVersion = ref("");
  const hasNewVersion = ref(false);
  const updateUrl = import.meta.env.VITE_PLUGIN_UPDATE_URL;

  onMounted(() => {
    getNewVersion().then((res) => {
      newVersion.value = res;
      hasNewVersion.value = currentVersion !== res;
    });
  });

  return {
    currentVersion,
    newVersion,
    hasNewVersion,
    updateUrl
  };
};

export default useVersion;
