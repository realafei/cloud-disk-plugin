import type {
  IListItem,
  IOriginListItem,
  TRootElementInsertMethod,
} from "@/provider/type";

import EnterComponent from "./EnterComponent.vue";
import Provider from "@/provider/type";
import querySelector from "@/utils/querySelector";
import fileNameParse from "@/utils/fileNameParse";

interface IReactFiberNode {
  child?: IReactFiberNode;
  return?: IReactFiberNode;
  sibling?: IReactFiberNode;
  pendingProps: any;
}

interface ICheckReactFiberNode {
  (node: IReactFiberNode): any | boolean | undefined | void;
}

const findReactFiberNode = (
  node: IReactFiberNode,
  check: ICheckReactFiberNode
): IReactFiberNode | undefined => {
  const list: IReactFiberNode[] = [node];
  while (list.length) {
    const item = list.shift() as IReactFiberNode;
    if (check(item)) {
      return item;
    } else {
      if (item.child) {
        list.push(item.child);
      }
      if (item.sibling) {
        list.push(item.sibling);
      }
      // let next = item;
      // while (next.sibling) {
      //   next = next.sibling;
      //   list.push(next);
      // }
    }
  }
};

export default class ProviderAli extends Provider {
  static test = () =>
    /^https:\/\/www\.ali(pan|yundrive)\.com\/drive\/file\/(backup|resource)/.test(
      location.href
    );

  type = "ali";
  rootElementId = "cloud-disk-plugin";
  rootElementInsertTarget = "[class^=nav-tab-content--]";
  rootElementInsertMethod: TRootElementInsertMethod = "append";

  EnterComponent = EnterComponent;

  async getOriginList() {
    const rootReactContainer = await this._getRootReactContainer();

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.listModel?.listModel
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const listModel =
      reactFiberNode.pendingProps.localStore.listModel.listModel;

    while (listModel.nextMarker) {
      await listModel.loadMoreData();
    }

    const originList = reactFiberNode.pendingProps.localStore.list;

    if (!originList) {
      return Promise.reject();
    }

    const result: IOriginListItem[] = [];
    originList.forEach((item: any) => {
      if (item.type === "file") {
        result.push({
          id: item.fileId,
          fullFileName: item.name,
          ...fileNameParse(item.name),
        });
      }
    });

    return result;
  }

  async renameRequest(data: IListItem[]) {
    const rootReactContainer = await this._getRootReactContainer();

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.list
    );

    if (!reactFiberNode) {
      return Promise.reject();
    }

    const originListMap = new Map(
      reactFiberNode.pendingProps.localStore.list.map((item: any) => [
        item.fileId,
        item,
      ])
    );

    const taskList: { item: IListItem; originItem: any }[] = [];

    data.forEach((item) => {
      const originItem: any = originListMap.get(item.id);
      if (originItem) {
        item.status = "ready";
        return taskList.push({ item, originItem });
      } else {
        item.status = "fail";
      }
    });

    while (taskList.length) {
      const { item, originItem } = taskList.shift() as {
        item: IListItem;
        originItem: any;
      };

      item.status = "pending";
      try {
        await originItem.rename(item.newFileName);
        if (originItem.name === item.newFileName) {
          item.status = "success";
        } else {
          item.status = "fail";
        }
      } catch (error) {
        item.status = "fail";
      }
      this._updateStatusCount();
      this._updateStatusList();
    }

    return Promise.resolve();
  }

  async refresh() {
    const rootReactContainer = await this._getRootReactContainer();

    const reactFiberNode = findReactFiberNode(
      rootReactContainer,
      (node) => node.pendingProps?.localStore?.listModel?.reload
    );

    if (!reactFiberNode) {
      location.reload();
      return Promise.resolve();
    }

    const tbodyScroller = querySelector(
      "[class^=node-list-table-view--]>[class^=tbody--]>div>[class^=scroller---]"
    );

    if (tbodyScroller) {
      tbodyScroller.scrollTop = 0;
    }

    const reload = reactFiberNode.pendingProps.localStore.listModel.reload;

    return reload();
  }

  private _rootReactContainer?: IReactFiberNode;
  private _getRootReactContainer(): Promise<IReactFiberNode> {
    if (this._rootReactContainer) {
      return Promise.resolve(this._rootReactContainer);
    }
    return querySelector("#root", true).then((res: Element) => {
      const keys = Object.keys(res) as Array<keyof Element>;
      const reactContainerKey = keys.find((item: keyof Element) =>
        item.startsWith("__reactContainer")
      );
      if (!reactContainerKey) {
        return Promise.reject();
      }
      this._rootReactContainer = res[
        reactContainerKey
      ] as unknown as IReactFiberNode;
      return this._rootReactContainer;
    });
  }
}
