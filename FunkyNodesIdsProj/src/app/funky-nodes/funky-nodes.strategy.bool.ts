import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

/** An improved naive approach where we don't store elements inside the array anymore,
 * but we use a boolean array, and the presence/absence of the element is indicated
 * by the boolean value of the element located at that index.
 * Space complexity: O(n) or  No of bytes = number of elements * 4 (no/32 in other languages...)
 * (in other languages a boolean would take only 1 bit of memory, but in JS it takes 4 bytes)
 * Time complexity: O(1) for add, O(n) for addAll, O(n) for retrieve all
 *
 */
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
