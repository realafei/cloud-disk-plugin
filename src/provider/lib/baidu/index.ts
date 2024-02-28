import type {
  IListItem,
  IOriginListItem,
  TRootElementInsertMethod,
} from "@/provider/type";

import { defineAsyncComponent } from "vue";
import Provider from "@/provider/type";
import sleep from "@/utils/sleep";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";

const EnterComponent = defineAsyncComponent(
  () => import("./EnterComponent.vue")
);

export default class ProviderBaidu extends Provider {
  static test = () =>
    location.href.startsWith(
      "https://pan.baidu.com/disk/main/#/index?category=all"
    );

  type = "baidu";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = ".wp-s-agile-tool-bar__header";
  rootElementInsertMethod: TRootElementInsertMethod = "prepend";

  EnterComponent = () => EnterComponent;

  getOriginList() {
    return querySelector(".nd-new-main-list").then((res: any) => {
      const fileList = res?.__vue__?.fileList;
      if (!fileList) {
        return Promise.reject();
      }
      const result: IOriginListItem[] = [];
      fileList.forEach((item: any) => {
        if (item.isdir === 0) {
          result.push({
            id: item.fs_id,
            fullFileName: item.formatName,
            ...fileNameParse(item.formatName),
          });
        }
      });

      return result;
    });
  }

  // getOriginListByElement() {
  //   const trList = document.querySelectorAll(
  //     "table.wp-s-pan-table__body-table tbody>tr"
  //   );

  //   const result: IOriginListItem[] = [];

  //   trList.forEach((item, index) => {
  //     const elementA = item.querySelector("a");
  //     if (!elementA) {
  //       return;
  //     }

  //     const elementImgAlt = item.querySelector("img[alt]")?.getAttribute("alt");
  //     if (elementImgAlt === "folder" || elementImgAlt === "share") {
  //       return;
  //     }
  //     const fullFileName = elementA.getAttribute("title") || "";
  //     result.push({
  //       id: item.getAttribute("data-id") || fullFileName || index + "",
  //       fullFileName,
  //       ...fileNameParse(fullFileName),
  //     });
  //   });

  //   return Promise.resolve(result);
  // }

  async renameRequest(data: IListItem[]) {
    const path = getPath();
    const token = await getToken();
    const filelist = data.map((item) => {
      return {
        id: item.id,
        path: path + item.oldFileName,
        newname: item.newFileName,
      };
    });
    const body = new FormData();
    body.append("filelist", JSON.stringify(filelist));
    return fetch(
      `https://pan.baidu.com/api/filemanager?async=2&onnest=fail&opera=rename&bdstoken=${token}&clienttype=0&app_id=250528&web=1`,
      {
        body,
        method: "POST",
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return Promise.reject(new Error("filemanager error"));
        }
      })
      .then((res) => {
        if (res.errno === 0) {
          return this.waitResult(res, data);
        }
        return Promise.reject(res);
      });
  }

  refresh() {
    // ".nd-main-list, .nd-new-main-list"
    return querySelector(".nd-new-main-list").then((res: any) => {
      res?.__vue__?.reloadList();
      return new Promise<void>((resolve) => {
        let count = 20;
        const timer = setInterval(() => {
          if (
            res.__vue__.$store.state.fileList.loadingList === false ||
            --count < 0
          ) {
            resolve();
            clearInterval(timer);
          }
        }, 500);
      });
    });
  }

  async waitResult(res: any, data: IListItem[]): Promise<any> {
    // 延迟时间，等待百度网盘更新，对比更新结果
    let count = 10;
    const timeout = Math.max(data.length * 50, 1000);

    while (count-- > 0) {
      console.log("waitResult", count);
      await this.refresh();
      const originList: IOriginListItem[] = await this.getOriginList();
      const originListMap = new Map(
        originList.map((item) => [item.id, item.fullFileName])
      );
      const isMatched = data.every(
        (item) =>
          originListMap.has(item.id) &&
          originListMap.get(item.id) === item.newFileName
      );
      if (!isMatched) {
        await sleep(timeout);
      } else {
        return res;
      }
    }
  }
}

export const getPath = () => {
  const currentPath = location.href.match(/path=(.+?)(?:&|$)/);
  let result;
  if (currentPath) {
    result = decodeURIComponent(currentPath[1]);
    // 补齐路径前缀斜杠
    if (result.charAt(0) !== "/") {
      result = "/" + result;
    }
    // 补齐路径后缀斜杠
    if (result.charAt(result.length - 1) !== "/") {
      result += "/";
    }
  } else {
    result = "/";
  }
  return result;
};

export const getToken = () => {
  return querySelector(".nd-main-list, .nd-new-main-list").then((res: any) =>
    res?.__vue__?.yunData?.bdstoken
      ? res.__vue__.yunData.bdstoken
      : Promise.reject()
  );
};
