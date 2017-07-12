import {FunkyNodesFactory} from './funky-nodes.factory'
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

export class FunkyNodesSet {

  private nodesMap: Map<string, FunkyNodesStorage> = new Map<string, FunkyNodesStorage>();

  private get(key: string): FunkyNodesStorage {
    let funkyNodesStorage = this.nodesMap.get(key);
    if (!funkyNodesStorage) {
      funkyNodesStorage = FunkyNodesFactory.get(key);
    }
    return funkyNodesStorage;
  }

  private set(key: string, value: FunkyNodesStorage): void {
    this.nodesMap.set(key, value);
  }

  add(nodeId: FunkyNodeId): void {
    if (nodeId.index < 1) {
      throw new Error('Cannot insert nodes with indexes less than 1');
    }
    const funkyNodesStorage = this.get(nodeId.key);
    funkyNodesStorage.add(nodeId.index);
    this.set(nodeId.key, funkyNodesStorage);
  }

  addAll(other: FunkyNodesSet): void {
    other.nodesMap.forEach((value: FunkyNodesStorage, key: string) => {
      const thisStorage = this.get(key);
      thisStorage.addAll(value);
      this.set(key, thisStorage);
    });
  }

  getEntireSet(): Set<FunkyNodeId> {
    const set = new Set<FunkyNodeId>();
    this.nodesMap.forEach((storage: FunkyNodesStorage, key: string) => {
      storage.getAllNodeIds().forEach((nodeId) => {
        set.add(nodeId);
      });
    });
    return set;
  }

  toString(): string {
    let result = '';
    this.getEntireSet().forEach((funkyNodeId) => {
      result += funkyNodeId.toString() + ' ';
    });
    return result;
  }

}

export class FunkyNodeId {

  key: string;
  index: number;

  constructor(key: string, index: number) {
    this.key = key;
    this.index = index;
  }

  toString(): string {
    return this.key + '/' + this.index;
  }

}


