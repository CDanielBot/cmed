import {FunkyNodeId} from './funky-nodes.model';

export abstract class FunkyNodesStorage {

  key;

  constructor(key: string) {
    this.key = key;
  }

  abstract add(elem: number): void;

  abstract addAll(other: FunkyNodesStorage);

  abstract getAllNodeIds(): Set<FunkyNodeId>;
}
