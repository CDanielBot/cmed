
import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

/* a naive approach where we store each element inside an array
 * we sort the array only when we need to retrieve all the elements in the set
 * Space complexity: O(n*4) or  No of bytes = 4 * number of elements
 * Time complexity: O(1) for add, O(nlogn) for retrieve all*/

export class FunkyNodesArrayStorage extends FunkyNodesStorage {

  private numbers: Array<number> = new Array<number>();

  private sort(): void {
    this.numbers.sort((e1, e2) => e1 - e2);
  }

  add(elem: number): void {
    this.numbers.push(elem);
  }

  addAll(other: FunkyNodesStorage): void {
    const indexes = new Array<Number>();
    other.getAllNodeIds().forEach((nodeId) => {
      indexes.push(nodeId.index);
    });
    this.numbers.push.apply(this.numbers, indexes);
  }


  getAllNodeIds(): Set<FunkyNodeId> {
    const elements = new Set<FunkyNodeId>();
    this.sort();
    for (const index of this.numbers) {
      elements.add(new FunkyNodeId(this.key, index));
    }
    return elements;
  }
}

