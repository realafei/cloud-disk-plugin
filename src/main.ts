import "@/style/index.css";
import { createApp } from "vue";
import App from "@/App.vue";
import { getProviderRef } from "@/provider";
import sleep from "@/utils/sleep";
import querySelector from "@/utils/querySelector";

const loop = () => {
  const providerRef = getProviderRef();

  if (!providerRef?.value) {
    return;
  }

  const target = querySelector(providerRef.value.rootElementInsertTarget);

  const rootElement = querySelector("#" + providerRef.value.rootElementId);

  if (target && !rootElement) {
    const app = createApp(App);
    app.provide("providerRef", providerRef);
    app.mount(
      (() => {
        const root = document.createElement("div");
        root.setAttribute("id", providerRef.value.rootElementId);
        target[providerRef.value.rootElementInsertMethod](root);
        return root;
      })()
    );
  }
};

while (loop) {
  loop();
  await sleep(300);
}
