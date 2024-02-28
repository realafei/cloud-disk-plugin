import type {
  IOriginListItem,
  TRootElementInsertMethod,
} from "@/provider/type";

import { defineAsyncComponent } from "vue";
import Provider from "@/provider/type";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";

const EnterComponent = defineAsyncComponent(
  () => import("./EnterComponent.vue")
);

export default class ProviderAli extends Provider {
  static test = () => {
    return (
      false &&
      location.href.startsWith(
        "https://www.aliyundrive.com/drive/file/resource"
      )
    );
  };

  type = "ali";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = "[class^=nav-tab-content--]";
  rootElementInsertMethod: TRootElementInsertMethod = "append";

  EnterComponent = () => EnterComponent;

  getOriginList() {
    return querySelector("[class^=node-list-table-view--]").then((res: any) => {
      const fileList = res?.__reactFiber.return.memoizedProps.value.dataSource;

      if (!fileList) {
        return Promise.reject();
      }
      const result: IOriginListItem[] = [];
      fileList.forEach((item: any) => {
        if (item.type === "file") {
          result.push({
            id: item.driveId,
            fullFileName: item.name,
            ...fileNameParse(item.name),
          });
        }
      });

      return result;
    });
  }

  renameRequest() {
    return Promise.reject();
  }

  refresh() {
    return Promise.reject();
  }
}
