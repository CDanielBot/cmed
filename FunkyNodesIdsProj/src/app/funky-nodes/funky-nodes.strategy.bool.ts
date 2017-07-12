import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

export class FunkyNodesBoolArrayStorage extends FunkyNodesStorage {

  private existance: boolean[] = [];

  add(elem: number): void {
    this.existance[elem] = true;
  }

  addAll(other: FunkyNodesStorage): void {
    other.getAllNodeIds().forEach((nodeId) => {
      this.add(nodeId.index);
    });
  }

  getAllNodeIds(): Set<FunkyNodeId> {
    const elements = new Set<FunkyNodeId>();
    this.existance.forEach((boolValue, position) => {
      if (boolValue === true) {
        elements.add(new FunkyNodeId(this.key, position));
      }
    });
    return elements;
  }
}
