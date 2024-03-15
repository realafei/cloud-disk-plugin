import type {
  IListItem,
  IOriginListItem,
  TRootElementInsertMethod,
} from "@/provider/type";

import EnterComponent from "./EnterComponent.vue";
import Provider from "@/provider/type";
import sleep from "@/utils/sleep";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";


export default class ProviderBaidu extends Provider {
  static test = () =>
    /^https:\/\/pan\.baidu\.com\/disk\/main(.+)?#\/index\?category=all/.test(
      location.href
    );

  type = "baidu";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = ".wp-s-aside-nav__main-top";
  rootElementInsertMethod: TRootElementInsertMethod = "append";

  EnterComponent = () => EnterComponent;

  async getOriginList() {
    const vue = this._getVue();

    const originList = vue?.fileList;

    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];

    originList.forEach((item: any) => {
      if (item.isdir === 0) {
        result.push({
          id: item.fs_id,
          fullFileName: item.formatName,
          ...fileNameParse(item.formatName),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const token = this._vueInstance?.yunData?.bdstoken;
    if (!token) {
      return Promise.reject();
    }
    // const path = getPath();
    const path = this._vueInstance.currentPath + "/";
    const body = new FormData();
    const filelist = data.map((item) => {
      item.status = "pending";
      return {
        id: item.id,
        path: path + item.oldFileName,
        newname: item.newFileName,
      };
    });
    this._updateStatus();
    this._vueInstance.renameFileList = filelist;
    body.append("filelist", JSON.stringify(filelist));
    this._vueInstance.editLoading = true;
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
      .then((res: any) => {
        if (res.errno === 0) {
          return res.taskid
            ? this.waitResult(res, data)
            : this._vueInstance?.renameSuccess();
        }
        return Promise.reject(res);
      })
      .then(() => {
        this.refresh();
      });
  }

  async refresh() {
    const vue = this._getVue();

    if (!vue?.reloadList) {
      location.reload();
      return Promise.resolve();
    }

    vue.reloadList();

    return new Promise<void>((resolve) => {
      let count = 20;
      const timer = setInterval(() => {
        if (vue.$store.state.fileList.loadingList === false || --count < 0) {
          resolve();
          clearInterval(timer);
        }
      }, 500);
    });
  }

  async waitResult(res: any, data?: IListItem[]): Promise<any> {
    this._vueInstance?.pollTask(res.taskid);
    // 延迟时间，等待百度网盘更新，对比更新结果
    while (this._vueInstance?.editLoading) {
      await sleep(100);
    }

    // let count = 10;
    // const timeout = Math.max(data.length * 50, 1000);

    // while (count-- > 0) {
    //   await this.refresh();
    //   const originList: IOriginListItem[] = await this.getOriginList();
    //   const originListMap = new Map(
    //     originList.map((item) => [item.id, item.fullFileName])
    //   );
    //   let isMatched = true;
    //   data.forEach((item) => {
    //     if (
    //       originListMap.has(item.id) &&
    //       originListMap.get(item.id) === item.newFileName
    //     ) {
    //       item.status = "success";
    //     } else {
    //       isMatched = false;
    //     }
    //   });
    //   if (!isMatched) {
    //     await sleep(timeout);
    //   } else {
    //     return res;
    //   }
    // }
  }

  private _vueInstance?: any;
  private _getVue(): any | undefined {
    if (this._vueInstance) {
      return this._vueInstance;
    }

    const element: any = querySelector(".nd-main-list, .nd-new-main-list");

    if (!element?.__vue__) {
      return;
    }

    this._vueInstance = element.__vue__;

    return this._vueInstance;
  }
}

// export const getPath = () => {
//   const currentPath = location.href.match(/path=(.+?)(?:&|$)/);
//   let result;
//   if (currentPath) {
//     result = decodeURIComponent(currentPath[1]);
//     // 补齐路径前缀斜杠
//     if (result.charAt(0) !== "/") {
//       result = "/" + result;
//     }
//     // 补齐路径后缀斜杠
//     if (result.charAt(result.length - 1) !== "/") {
//       result += "/";
//     }
//   } else {
//     result = "/";
//   }
//   return result;
// };
