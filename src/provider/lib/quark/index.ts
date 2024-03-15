import type {
  IListItem,
  IOriginListItem,
  TRootElementInsertMethod,
} from "@/provider/type";

import EnterComponent from "./EnterComponent.vue";
import Provider from "@/provider/type";
import fileNameParse from "@/utils/fileNameParse";
import { findReactFiberNode, getRootReactContainer } from "@/utils/reactFiber";

export default class ProviderQuark extends Provider {
  static test = () =>
    /^https:\/\/pan.quark.cn\/list#\/list\//.test(location.href);

  type = "quark";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget =
    "#ice-container .section-main > .section-header.list-header > .btn-operate > .btn-main";

  rootElementInsertMethod: TRootElementInsertMethod = "prepend";

  EnterComponent = () => EnterComponent;

  private _rootReactContainerSelectors = "#ice-container";

  async getOriginList() {
    const rootReactContainer = await getRootReactContainer(
      this._rootReactContainerSelectors,
      true
    );

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.store?.getState?.()?.file?.listType
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const state = reactFiberNode.pendingProps.store.getState();

    const originList = state.file?.[state.file.listType]?.list;
    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    originList.forEach((item: any) => {
      if (item.file) {
        result.push({
          id: item.fid,
          fullFileName: item.file_name,
          ...fileNameParse(item.file_name),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const rootReactContainer = await getRootReactContainer(
      this._rootReactContainerSelectors,
      true
    );

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.rename
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const taskList: IListItem[] = [];

    data.forEach((item) => {
      item.status = "ready";
      taskList.push(item);
    });

    while (taskList.length) {
      const item = taskList.shift() as IListItem;

      item.status = "pending";
      try {
        const res = await reactFiberNode.pendingProps.rename({
          fid: item.id,
          fileName: item.newFileName,
        });
        if (res.status === 200 && res.code === 0) {
          item.status = "success";
        } else {
          item.status = "fail";
        }
      } catch (error) {
        item.status = "fail";
      }
      this._updateStatus();
    }

    return this.refresh();
  }

  async refresh() {
    const rootReactContainer = await getRootReactContainer(
      this._rootReactContainerSelectors,
      true
    );

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.onRefresh
    );

    if (!reactFiberNode) {
      location.reload();
      return Promise.resolve();
    }

    const reload = reactFiberNode.pendingProps.onRefresh;

    return reload();
  }
}
