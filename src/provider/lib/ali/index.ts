import type { TRootElementInsertMethod } from "@/provider/type";

import { defineAsyncComponent } from "vue";
import Provider from "@/provider/type";

const EnterComponent = defineAsyncComponent(
  () => import("./EnterComponent.vue"),
);

export default class ProviderAli extends Provider {
  static test = () => {
    return (
      false &&
      location.href.startsWith(
        "https://www.aliyundrive.com/drive/file/resource",
      )
    );
  };

  type = "ali";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = "[class^=nav-tab-content--]";
  rootElementInsertMethod: TRootElementInsertMethod = "append";

  EnterComponent = () => EnterComponent;

  getOriginList() {
    return Promise.reject();
  }

  renameRequest() {
    return Promise.reject();
  }

  refresh() {
    return Promise.reject();
  }
}
