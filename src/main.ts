import type { Ref } from "vue";
import type Provider from "@/provider/type";

import { createApp } from "vue";
import "@/style/index.css";
import App from "@/App.vue";
import { getProviderRef } from "@/provider";
import querySelector from "@/utils/querySelector";

window.setInterval(
  () => getProviderRef().then((providerRef) => init(providerRef)),
  300
);

const init = (providerRef: Ref<Provider>) => {
  querySelector(providerRef.value.rootElementInsertTarget).then((target) =>
    querySelector("#" + providerRef.value.rootElementId).catch(() => {
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
    })
  );
};
