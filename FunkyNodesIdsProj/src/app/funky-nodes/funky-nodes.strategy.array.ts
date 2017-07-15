import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

/** A naive approach where we store each element inside an array
 * we sort the array only when we need to retrieve all the elements in the set
 * Space complexity: O(n) or  No of bytes = 8 * number of elements (each number elements takes 8 bytes in JS)
 * Time complexity: O(1) for add, O(n) for addAll, O(nlogn) for retrieve all
 * */

export class FunkyNodesArrayStorage extends FunkyNodesStorage {

  private numbers: Array<number> = new Array<number>();

  private sort(): void {
    this.numbers.sort((e1, e2) => e1 - e2);
  }

  add(elem: number): void {
    this.numbers.push(elem);
  }

  addAll(other: FunkyNodesStorage): void {
    const numbers = this.numbers;
    other.getAllNodeIds().forEach((nodeId) => {
      numbers.push(nodeId.index);
    });
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

