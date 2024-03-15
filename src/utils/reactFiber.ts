import querySelector from "@/utils/querySelector";

export interface IReactFiberNode {
  child?: IReactFiberNode;
  return?: IReactFiberNode;
  sibling?: IReactFiberNode;
  pendingProps: any;
}

export interface ICheckReactFiberNode {
  (node: IReactFiberNode): any | boolean | undefined | void;
}

export const findReactFiberNode = (
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

export let rootReactContainer: IReactFiberNode;

function _getRootReactContainer(selectors: string): IReactFiberNode | undefined;
function _getRootReactContainer(
  selectors: string,
  isPromise?: boolean
): Promise<IReactFiberNode>;
function _getRootReactContainer(
  selectors: string,
  isPromise: boolean = true
): Promise<IReactFiberNode> | IReactFiberNode | undefined {
  if (rootReactContainer) {
    return isPromise ? Promise.resolve(rootReactContainer) : rootReactContainer;
  }
  const rootElement = querySelector(selectors);

  if (!rootElement) {
    return isPromise ? Promise.reject() : undefined;
  }
  const keys = Object.keys(rootElement) as Array<keyof Element>;

  const reactContainerKey = keys.find((item: keyof Element) =>
    item.startsWith("__reactContainer")
  );

  if (!reactContainerKey) {
    return isPromise ? Promise.reject() : undefined;
  }

  rootReactContainer = rootElement[
    reactContainerKey
  ] as unknown as IReactFiberNode;

  return isPromise ? Promise.resolve(rootReactContainer) : rootReactContainer;
}

export const getRootReactContainer = _getRootReactContainer;
