import type { Component } from "vue";
import complementZero from "@/utils/complementZero";

export abstract class Provider {
  // 匹配测试
  static test() {
    return false;
  }
  // 类型
  public abstract type: string;
  // 根元素 ID
  public abstract rootElementId: string;
  // 根元素插入目标
  public abstract rootElementInsertTarget: string;
  // 根元素插入方式
  public abstract rootElementInsertMethod: TRootElementInsertMethod;
  // 入口组件
  public abstract EnterComponent: Component;

  // 显示加载
  public isLoading: boolean = false;
  // 更新加载中
  public isUpdateLoading: boolean = false;
  // 控制加载中
  public isControlLoading: boolean = false;
  // 预览加载中
  public isPreviewLoading: boolean = false;

  // 主面板显示控制
  public visible: boolean = false;
  public setVisible(val: boolean = false) {
    if (
      !val &&
      (this.isLoading ||
        this.isUpdateLoading ||
        this.isControlLoading ||
        this.isPreviewLoading)
    ) {
      return false;
    }
    this.visible = val;
    if (val) {
      this._updateOriginList();
    }
  }

  // 替换参数
  public replaceParams: ReplaceParams = new ReplaceParams(() =>
    this._onReplaceParamsUpdate.call(this)
  );
  // 替换参数禁用
  public replaceParamsDisabled: boolean = false;
  // 替换参数更新回调函数
  private _onReplaceParamsUpdate() {
    this._updateCurrentList();
  }
  // 重置替换参数
  private _resetReplaceParams() {
    this.replaceParams.reset();
  }

  // 原始文件列表数据
  protected originList: IOriginListItem[] = [];
  // 获取原始文件列表数据
  protected abstract getOriginList(): Promise<IOriginListItem[]>;
  // 更新原始文件列表数据
  private _updateOriginList(): void {
    this.isLoading = true;
    this._uncheckedList = new Set();
    this.getOriginList()
      .then((res) => {
        this.isLoading = false;
        this.originList = res;
        this._updateCurrentList();
      })
      .catch(() => {
        this.isLoading = false;
        this.originList = [];
        this._updateCurrentList();
      });
  }

  // 当前文件列表数据
  private _currentList: IListItem[] = [];
  public get currentList(): IListItem[] {
    return this._currentList;
  }
  // 更新当前文件列表数据
  private _updateCurrentList(): void {
    const renameMode = this.replaceParams.renameMode;

    const result: IListItem[] = this.originList.map((item) => {
      return {
        id: item.id,
        ext: item.ext,
        status: "none",
        isError: false,
        fileName: item.fileName,
        isChange: false,
        isMatched: true,
        isChecked: !this._uncheckedList.has(item.id),
        isLoading: false,
        oldFileName: item.fullFileName,
        newFileName: "",
      };
    });

    const newFileNameSet: Set<string> = new Set();

    if (renameMode === RENAME_MODE_SERIES) {
      if (this.replaceParams.title || this.replaceParams.season) {
        const season = this.replaceParams.season
          ? ".S" + complementZero(this.replaceParams.season)
          : "";
        result.forEach((item, index) => {
          const fileName = this.replaceParams.title || item.fileName;
          let newFileName = fileName + season;
          if (this.replaceParams.autoEpisode) {
            const episode =
              (season ? "" : ".") + "E" + complementZero(index + 1);
            newFileName += episode;
          }
          newFileName += "." + item.ext;
          item.newFileName = newFileName.trim();
          this._listItemGeneralMethod(item, newFileNameSet);
        });
      }
    }

    if (renameMode === RENAME_MODE_PATTERN) {
      let regexp: RegExp | undefined;

      if (this.replaceParams.pattern) {
        try {
          regexp = new RegExp(this.replaceParams.pattern);
        } catch (error) {
          console.error("regexp error", error);
        }
        if (regexp) {
          result.forEach((item, index) => {
            if (this.replaceParams.autoEpisode) {
              item.isMatched = !!regexp?.test(item.fileName);
              if (item.isMatched) {
                let newFileName = item.fileName.replace(
                  regexp as RegExp,
                  this.replaceParams.replace
                );
                newFileName +=
                  (newFileName ? ".E" : "E") + complementZero(index + 1);
                if (newFileName) {
                  newFileName += "." + item.ext;
                }
                item.newFileName = newFileName.trim();
                this._listItemGeneralMethod(item, newFileNameSet);
              }
            } else {
              item.isMatched = !!regexp?.test(item.oldFileName);
              if (item.isMatched) {
                item.newFileName = item.oldFileName.replace(
                  regexp as RegExp,
                  this.replaceParams.replace
                );
                this._listItemGeneralMethod(item, newFileNameSet);
              }
            }
          });
        }
      }
    }

    this._currentList = result;
    this._updateHasError();
    this._updateHasChange();
    this._updateHasCheckedAll();
    this._updateMatchedCount();
    this._updateStatusCount();
    this._updateShouldContinue();
    this._updateStatusList();
    this._emitCurrentListUpdateHandler();
  }
  // 文件列表项通用处理
  private _listItemGeneralMethod(item: IListItem, newFileNameSet: Set<string>) {
    item.isChange = item.oldFileName !== item.newFileName;
    item.isError =
      item.isChecked &&
      (!item.newFileName || newFileNameSet.has(item.newFileName));
    item.isChecked && newFileNameSet.add(item.newFileName);
  }

  // 文件列表更新回调函数集合
  private _currentListUpdateHandlerSet: Set<
    (currentList: IListItem[]) => void
  > = new Set();
  // 绑定文件列表更新回调函数
  public onCurrentListUpdate(
    handler: (currentList: IListItem[]) => void
  ): void {
    if (!this._currentListUpdateHandlerSet.has(handler)) {
      this._currentListUpdateHandlerSet.add(handler);
    }
  }
  // 解绑文件列表更新回调函数
  public offCurrentListUpdate(
    handler: (currentList: IListItem[]) => void
  ): void {
    if (this._currentListUpdateHandlerSet.has(handler)) {
      this._currentListUpdateHandlerSet.delete(handler);
    }
  }
  // 触发文件列表更新回调函数
  private _emitCurrentListUpdateHandler(): void {
    this._currentListUpdateHandlerSet.forEach((handler) => {
      handler(this._currentList);
    });
  }

  // 取消选中的文件列表
  private _uncheckedList: Set<string> = new Set();
  // 更新是否选中文件列表
  public updateItemIsCheck(item: IListItem, val: boolean): void {
    if (val) {
      this._uncheckedList.delete(item.id);
    } else {
      this._uncheckedList.add(item.id);
    }
    this._updateCurrentList();
  }

  // 更新是否全选
  public updateCheckedAll(val: boolean): void {
    if (val) {
      this._uncheckedList = new Set();
    } else {
      this._currentList.forEach((item) => {
        this._uncheckedList.add(item.id);
      });
    }
    this._updateCurrentList();
  }

  // 是否有错误
  public hasError: boolean = false;
  private _errorCount: number = 0;
  private _updateHasError(): void {
    let errorCount = 0;
    this._currentList.forEach((item) => {
      if (item.isChecked && item.isError) {
        errorCount++;
      }
    });
    this.hasError = errorCount > 0;
    this._errorCount = errorCount;
  }
  // 匹配的数量
  private _matchedCount: number = 0;
  private _updateMatchedCount(): void {
    this._matchedCount = this._currentList.reduce((res, item) => {
      if (item.isChecked && item.isMatched) {
        res += 1;
      }
      return res;
    }, 0);
  }
  // 是否有变更
  public hasChange: boolean = false;
  private _updateHasChange(): void {
    this.hasChange = this._currentList.some(
      (item) => item.isChecked && item.isChange
    );
  }
  // 是否全选
  public hasCheckedAll: boolean = false;
  // 是否全不选
  public hasUncheckedAll: boolean = false;
  private _updateHasCheckedAll(): void {
    this.hasCheckedAll = this._uncheckedList.size === 0;
    this.hasUncheckedAll =
      this._uncheckedList.size === this._currentList.length;
  }
  // 是否可继续
  public shouldContinue: boolean = false;
  private _updateShouldContinue(): void {
    this.shouldContinue = !this.hasError && this.hasChange;
  }
  // 状态计数
  private _pendingStatusCount: number = 0;
  private _successStatusCount: number = 0;
  private _failStatusCount: number = 0;
  protected _updateStatusCount(): void {
    let pendingStatusCount = 0;
    let successStatusCount = 0;
    let failStatusCount = 0;
    this._currentList.forEach((item) => {
      if (item.status === "success") {
        successStatusCount++;
      } else if (item.status === "fail") {
        failStatusCount++;
      } else if (item.status === "pending") {
        pendingStatusCount++;
      }
    });
    this._pendingStatusCount = pendingStatusCount;
    this._successStatusCount = successStatusCount;
    this._failStatusCount = failStatusCount;
  }

  public statusList: IStatusList[] = [];
  protected _updateStatusList() {
    const result: IStatusList[] = [];
    if (!this._currentList.length) {
      result.push({ message: "❌ 无文件" });
    } else {
      if (this.isUpdateLoading) {
        if (this._pendingStatusCount) {
          result.push({
            message: `加载中(${this._pendingStatusCount})`,
            className: "blue",
          });
        }
        if (this._successStatusCount) {
          result.push({
            message: `成功(${this._successStatusCount})`,
            className: "green",
          });
        }
        if (this._failStatusCount) {
          result.push({
            message: `失败(${this._failStatusCount})`,
            className: "red",
          });
        }
      } else if (this.shouldContinue) {
        result.push({ message: "✅ 准备就绪", className: "green" });
      }
      if (this.hasError) {
        result.push({
          message: `❌ 文件名重复(${this._errorCount})`,
          className: "red",
        });
      }
      if (!this.hasChange) {
        result.push({ message: "❕ 暂无改动", className: "yellow" });
      }
      const checked = this._currentList.length - this._uncheckedList.size;
      if (this._uncheckedList.size && checked) {
        if (this._uncheckedList.size > checked) {
          result.push({ message: `已选中(${checked})`, className: "blue" });
        } else {
          result.push({
            message: `未选中(${this._uncheckedList.size})`,
            className: "yellow",
          });
        }
      }
      const unmatchedCount = checked - this._matchedCount;
      if (unmatchedCount && this._matchedCount) {
        if (unmatchedCount > this._matchedCount) {
          result.push({
            message: `已匹配(${this._matchedCount})`,
            className: "blue",
          });
        } else {
          result.push({
            message: `未匹配(${unmatchedCount})`,
            className: "yellow",
          });
        }
      }
    }
    this.statusList = result;
  }

  // 刷新数据
  protected abstract refresh(): Promise<any>;
  // 发起重命名请求
  protected abstract renameRequest(data?: IListItem[]): Promise<any>;
  // 批量重命名
  public batchRename(): void {
    if (!this.shouldContinue) {
      return;
    }
    this.isUpdateLoading = true;
    this.replaceParamsDisabled = true;
    this._updateStatusList();
    const data = this.currentList.filter(
      (item) => item.isChecked && item.isChange && !item.isError
    );
    this.renameRequest(data)
      .then(() => {
        this.visible = false;
        this._resetReplaceParams();
      })
      .catch(() => {
        this.refresh().then(() => {
          this._updateOriginList();
        });
      })
      .finally(() => {
        this.isUpdateLoading = false;
        this.replaceParamsDisabled = false;
        this._updateStatusList();
      });
  }
  // 重置
  public reset(): void {
    this._resetReplaceParams();
    this._updateOriginList();
  }
}

export class ReplaceParams {
  // 剧名
  private _title: string = "";
  public get title() {
    return this._title;
  }
  public set title(val) {
    this._title = val;
    this._onUpdate();
  }
  // 季数
  private _season: string = "";
  public get season() {
    return this._season;
  }
  public set season(val) {
    this._season = val;
    this._onUpdate();
  }
  // 正则
  private _pattern: string = "";
  public get pattern() {
    return this._pattern;
  }
  public set pattern(val) {
    this._pattern = val;
    this._onUpdate();
  }
  // 替换文本
  private _replace: string = "";
  public get replace() {
    return this._replace;
  }
  public set replace(val) {
    this._replace = val;
    this._onUpdate();
  }
  // 自动集数
  public _autoEpisode: boolean = true;
  public get autoEpisode() {
    return this._autoEpisode;
  }
  public set autoEpisode(val) {
    this._autoEpisode = val;
    this._onUpdate();
  }
  // 重命名模式
  private _renameMode: TRenameMode = RENAME_MODE_SERIES;
  public get renameMode() {
    return this._renameMode;
  }
  public set renameMode(val) {
    this._renameMode = val;
    this._onUpdate();
  }

  // private _onUpdateTimer: NodeJS.Timeout | undefined;
  private _onUpdate = () => {
    // if (this._onUpdateTimer) {
    //   clearTimeout(this._onUpdateTimer);
    // }
    // this._onUpdateTimer = setTimeout(() => {
    //   this.onUpdateHandler(this);
    //   this._onUpdateTimer = undefined;
    // }, 100);

    this.onUpdateHandler && this.onUpdateHandler(this);
  };
  private onUpdateHandler: (replaceParams: ReplaceParams) => void;

  public reset(val?: any) {
    this.title = val?.title || "";
    this.season = val?.season || "";
    this.pattern = val?.pattern || "";
    this.replace = val?.replace || "";
    this.autoEpisode = val ? !!val.autoEpisode : true;
    this.renameMode = val?.renameMode || RENAME_MODE_SERIES;
  }

  constructor(onUpdateHandler: (replaceParams: ReplaceParams) => void) {
    this.onUpdateHandler = onUpdateHandler;
  }
}

export type TRenameMode = "series" | "pattern";
export const RENAME_MODE_SERIES: TRenameMode = "series";
export const RENAME_MODE_PATTERN: TRenameMode = "pattern";

export type TRootElementInsertMethod = "append" | "prepend";
export const ROOT_ELEMENT_INSERT_METHOD_APPEND = "append";
export const ROOT_ELEMENT_INSERT_METHOD_PREPEND = "prepend";

export interface IOriginListItem {
  id: string;
  ext: string;
  fileName: string;
  fullFileName: string;
}

type IListItemStatus = "none" | "ready" | "pending" | "success" | "fail";

export interface IListItem {
  id: string;
  ext: string;
  status: IListItemStatus;
  isError: boolean;
  fileName: string;
  isChange: boolean;
  isMatched: boolean;
  isChecked: boolean;
  isLoading: boolean;
  oldFileName: string;
  newFileName: string;
}

export interface IStatusList {
  message: string;
  className?: string;
}

export default Provider;
