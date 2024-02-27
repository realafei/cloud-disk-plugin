import type { TRootElementInsertMethod } from "@/provider/type";

import { defineAsyncComponent } from "vue";
import Provider from "@/provider/type";

const EnterComponent = defineAsyncComponent(
  () => import("./EnterComponent.vue"),
);

export default class ProviderQuark extends Provider {
  static test = () => {
    return (
      false && location.href.startsWith("https://pan.quark.cn/list#/list/all")
    );
  };

  type = "quark";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget =
    "#ice-container .ant-layout .section-header .btn-operate .btn-main";

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
