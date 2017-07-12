import {FunkyNodesFactory} from './funky-nodes.factory'

export class FunkyNodesSet {

  private nodesMap: Map<string, FunkyNodesStorage> = new Map<string, FunkyNodesStorage>();

  private get(key: string): FunkyNodesStorage {
    let funkyNodesStorage = this.nodesMap.get(key);
    if (!funkyNodesStorage) {
      funkyNodesStorage = FunkyNodesFactory.get();
    }
    return funkyNodesStorage;
  }

  private set(key: string, value: FunkyNodesStorage): void {
    this.nodesMap.set(key, value);
  }

  add(nodeId: FunkyNodeId): void {
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

  getEntireSet(): Array<FunkyNodeId> {
    const set = new Array<FunkyNodeId>();
    this.nodesMap.forEach((storage: FunkyNodesStorage, key: string) => {
      set.push.apply(set, storage.getAllNodeIds(key));
    });
    return set;
  }

  toString(): string {
    var result = '';
    const set = this.getEntireSet();
    for(const funkyNodeId of set){
      result += funkyNodeId.toString() + ' ';
    }
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

  toString(): string{
    return this.key + '/' + this.index;
  }

}

export interface FunkyNodesStorage {
  add(elem: number): void;
  addAll(other: FunkyNodesStorage);
  getAllNodeIndexes(): Array<number>;
  getAllNodeIds(key: string): Array<FunkyNodeId>;
}
