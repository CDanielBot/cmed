import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.model';

export class Range {

  lowerBound: number;
  upperBound: number;

  leftRange: Range;
  rightRange: Range;

  constructor(element: number)
  constructor(lowerBound: number, upperBound?: number, leftRange?: Range, rightRange?: Range) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound || lowerBound;

    this.leftRange = leftRange || null;
    this.rightRange = rightRange || null;
  }

  private isAdjacentLeft(other: Range): boolean {
    return other && this.isLeftNeighbour(other.upperBound);
  }

  private isAdjacentRight(other: Range): boolean {
    return other && this.isRightNeighbour(other.lowerBound);
  }

  private joinLeft(): void {
    this.lowerBound = this.leftRange.lowerBound;
    this.leftRange = this.leftRange.leftRange;
  }

  private joinRight(): void {
    this.upperBound = this.rightRange.upperBound;
    this.rightRange = this.rightRange.rightRange;
  }

  contains(other: Range): boolean {
    return this.lowerBound <= other.lowerBound && other.upperBound <= this.upperBound;
  }

  overlapsLeft(other: Range): boolean {
    return other.lowerBound < this.lowerBound && this.lowerBound <= other.upperBound;
  }

  overlapsRight(other: Range): boolean {
    return other.upperBound > this.upperBound && this.lowerBound >= other.lowerBound;
  }

  isLeftNeighbour(elem): boolean {
    return elem + 1 === this.lowerBound;
  }

  isRightNeighbour(elem): boolean {
    return elem - 1 === this.upperBound;
  }

  decrementLowerBound(): void {
    this.lowerBound--;
    if (this.isAdjacentLeft(this.leftRange)) {
      this.joinLeft();
    }
  }

  incrementUpperBound(): void {
    this.upperBound++;
    if (this.isAdjacentRight(this.rightRange)) {
      this.joinRight();
    }
  }

  isLessThan(other: Range): boolean {
    return this.upperBound < other.lowerBound;
  }

  isGreaterThan(other: Range): boolean {
    return this.lowerBound > other.upperBound;
  }

  extendLowerBound(newLowerBound: number): void {
    this.lowerBound = newLowerBound;
    this.eliminateOverlaps();
  }

  extendUpperBound(newUpperBound: number): void {
    this.upperBound = newUpperBound;
    this.eliminateOverlaps();
  }

  private eliminateOverlaps(): void {
    if (this.leftRange && this.overlapsLeft(this.leftRange)) {
      this.extendLowerBound(this.leftRange.lowerBound);
      this.joinLeft();
    } else if (this.rightRange && this.overlapsRight(this.rightRange)) {
      this.extendUpperBound((this.rightRange.upperBound));
      this.joinRight();
    }
  }


  getCurrentNodeIds(key: string): Array<FunkyNodeId> {
    const nodeIds = new Array<FunkyNodeId>();
    for (let i = this.lowerBound; i <= this.upperBound; i++) {
      nodeIds.push(new FunkyNodeId(key, i));
    }
    return nodeIds;
  }
}

/**
 * Storage implementation with Discrete Interval Encoding Trees (DIETs)
 * Data structure similar to binary search tree, only that it stores ranges of values instead of numbers.
 * Properties:
 *  - if we add a value to an existing range, the range remains unchanged
 *  - if we add a value that is adjacent to range, the range should increase/decrease accordingly
 *  - in case the range increases/decreases, and it becomes adjacent to left/right nodes, it should be merged into one node
 *
 * Performance:
 * - memory:
 *        - best case: O(1) - we store only 1 interval
 *        - worst case: O(n) - we store many non-adjacent intervals
 *        - average case: improved O(n) - we store fewer intervals than number of elements
 *  - operations:
 *        - insert one element: O(logN) in average, O(n) in worst case*
 *        - insert many elements: O(nlogN)
 *        * worst-case - all the elements come as pre-ordered
 */
export class FunkyNodesTreeStorage implements FunkyNodesStorage {

  root: Range;

  add(elem: number): void {
    this.root = this.addElem(elem, this.root);
  }

  addAll(other: FunkyNodesTreeStorage): void {
    // while iterating on 2nd tree, add ranges to first tree
    other._addRangesWhileIteratingInPreOrder(other.root, this);
  }

  _addRangesWhileIteratingInPreOrder(currentRange: Range, originalStorage: FunkyNodesTreeStorage): void {
    if (!currentRange) {
      return;
    }

    originalStorage.addRange(currentRange);

    if (currentRange.leftRange) {
      this._addRangesWhileIteratingInPreOrder(currentRange.leftRange, originalStorage);
    }

    if (currentRange.rightRange) {
      this._addRangesWhileIteratingInPreOrder(currentRange.rightRange, originalStorage);
    }
  }


  getAllNodeIndexes(): Array<number> {
    return null;
  }

  getAllNodeIds(key: string): Array<FunkyNodeId> {
    const allNodes = new Array<FunkyNodeId>();
    this.inOrderTreeIteration(key, this.root, allNodes);
    return allNodes;
  }


  private inOrderTreeIteration(key, currentRange: Range, nodeIds: Array<FunkyNodeId>): Array<FunkyNodeId> {
    if (!currentRange) {
      return [];
    }

    if (currentRange.leftRange) {
      this.arradAddAll(nodeIds, this.inOrderTreeIteration(key, currentRange.leftRange, nodeIds));
    }

    this.arradAddAll(nodeIds, currentRange.getCurrentNodeIds(key));

    if (currentRange.rightRange) {
      this.arradAddAll(nodeIds, this.inOrderTreeIteration(key, currentRange.rightRange, nodeIds));
    }
  }

  private arradAddAll(nodeIds1: Array<FunkyNodeId>, nodeIds2: Array<FunkyNodeId>): void {
    nodeIds1.push.apply(nodeIds1, nodeIds2);
  }

  private addElem(elem: number, currentRange: Range): Range {

    if (!currentRange) {
      // we reached bottom, thus we create a range of 1 element (elem,elem) with no children
      return new Range(elem);
    }

    if (elem < currentRange.lowerBound) {
      if (currentRange.isLeftNeighbour(elem)) {
        // extend range and possibly join with left neighbour
        currentRange.decrementLowerBound();
      } else {
        currentRange.leftRange = this.addElem(elem, currentRange.leftRange);
      }

    } else if (elem > currentRange.upperBound) {
      if (currentRange.isRightNeighbour(elem)) {
        // extend range and possibly join with right neighbour
        currentRange.incrementUpperBound();
      } else {
        currentRange.rightRange = this.addElem(elem, currentRange.rightRange);
      }
    }

    return currentRange;
  }

  private addRange(rangeToAdd: Range): void {
    this._addRange(rangeToAdd, this.root);
  }

  private _addRange(rangeToAdd: Range, currentRange: Range): void {
    if (currentRange.contains(rangeToAdd)) {
      // range already added
      return;
    } else if (currentRange.overlapsLeft(rangeToAdd)) {
      currentRange.extendLowerBound(rangeToAdd.lowerBound);
    } else if (currentRange.overlapsRight(rangeToAdd)) {
      currentRange.extendUpperBound(rangeToAdd.upperBound)
    } else if (rangeToAdd.isLessThan(currentRange)) {
      if (currentRange.leftRange) {
        this._addRange(rangeToAdd, currentRange.leftRange);
      } else {
        // reached bottom
        currentRange.leftRange = rangeToAdd;
      }
    } else if (rangeToAdd.isGreaterThan(currentRange)) {
      if (currentRange.rightRange) {
        this._addRange(rangeToAdd, currentRange.rightRange);
      } else {
        // reached bottom
        currentRange.rightRange = rangeToAdd;
      }
    }
  }


}
