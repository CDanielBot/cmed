
import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.model';

export class FunkyNodesBoolArrayStorage implements FunkyNodesStorage {

  private existance: boolean[] = [];

  add(elem: number): void {
    this.existance[elem] = true;
  }

  addAll(other: FunkyNodesStorage): void {
    for (const index of other.getAllNodeIndexes()) {
      this.add(index);
    }
  }

  getAllNodeIndexes(): Array<number> {
    const indexes = new Array<number>();
    this.existance.forEach((boolValue, position) => {
      if (boolValue === true) {
        indexes.push(position);
      }
    });
    return indexes;
  }

  getAllNodeIds(key: string): Array<FunkyNodeId> {
    const elements = new Array<FunkyNodeId>();
    this.existance.forEach((boolValue, position) => {
      if (boolValue === true) {
        elements.push(new FunkyNodeId(key, position));
      }
    });
    return elements;
  }
}
