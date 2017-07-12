
import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.model';

/* a naive approach where we store each element inside an array
 * we sort the array only when we need to retrieve all the elements in the set
 * Space complexity: O(n*4) or  No of bytes = 4 * number of elements
 * Time complexity: O(1) for add, O(nlogn) for retrieve all*/

export class FunkyNodesArrayStorage implements FunkyNodesStorage {

  private numbers: Array<number> = new Array<number>();

  private sort(): void {
    this.numbers.sort((e1, e2) => e1 - e2);
  }

  add(elem: number): void {
    this.numbers.push(elem);
  }

  addAll(other: FunkyNodesStorage): void {
    this.numbers.push.apply(this.numbers, other.getAllNodeIndexes());
  }

  getAllNodeIndexes(): Array<number> {
    this.sort();
    return this.numbers.slice(0);
  }

  getAllNodeIds(key: string): Array<FunkyNodeId> {
    const elements = new Array<FunkyNodeId>();
    this.sort();
    for (const index of this.numbers) {
      elements.push(new FunkyNodeId(key, index));
    }
    return elements;
  }
}

