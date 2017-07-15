import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.strategy.generic';

export class Range {

  lowerBound: number;
  upperBound: number;

  leftRange: Range;
  rightRange: Range;

  constructor(lowerBound: number, upperBound?: number, leftRange?: Range, rightRange?: Range) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound || lowerBound;

    this.leftRange = leftRange || null;
    this.rightRange = rightRange || null;
  }

  private hasAdjacentRangeInLeft(other: Range): boolean {
    return other && (this.hasNeighbourInLeft(other.upperBound) || this.lowerBound === other.upperBound);
  }

  private hasAdjacentRangeInRight(other: Range): boolean {
    return other && (this.hasNeighbourInRight(other.lowerBound) || this.upperBound === other.lowerBound);
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

  hasOverlappingOrAdjacentRangeInLeft(other: Range): boolean {
    return this.lowerBound > other.lowerBound && (this.lowerBound <= other.upperBound || this.hasNeighbourInLeft(other.upperBound));
  }

  hasOverlappingOrAdjacentRangeInRight(other: Range): boolean {
    return other.upperBound > this.upperBound && (this.upperBound >= other.lowerBound || this.hasNeighbourInRight(other.lowerBound));
  }

  hasNeighbourInLeft(elem): boolean {
    return elem + 1 === this.lowerBound;
  }

  hasNeighbourInRight(elem): boolean {
    return elem - 1 === this.upperBound;
  }

  decrementLowerBound(): void {
    this.lowerBound--;
    if (this.hasAdjacentRangeInLeft(this.leftRange)) {
      this.joinLeft();
    }
  }

  incrementUpperBound(): void {
    this.upperBound++;
    if (this.hasAdjacentRangeInRight(this.rightRange)) {
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
    this.mergeWithFirstOverlappingInUpperBound();
  }

  extendUpperBound(newUpperBound: number): void {
    this.upperBound = newUpperBound;
    this.mergeWithFirstOverlappingInLowerBound();
  }

  private mergeWithFirstOverlappingInUpperBound(): void {

    if (!this.leftRange) {
      // extending bottom range doesn't require merging other ranges
      return;
    }

    if (this.hasAdjacentRangeInLeft(this.leftRange)) {
      this.joinLeft();
    } else {
      let currentRange = this.leftRange;
      let parentOfCurrentRange;

      while (currentRange && !this.hasOverlappingOrAdjacentRangeInLeft(currentRange)) {
        parentOfCurrentRange = currentRange;
        currentRange = currentRange.rightRange;
      }

      // make sure parent is set to current if no traversal has happened
      if (!parentOfCurrentRange) {
        parentOfCurrentRange = this;
      }

      if (currentRange) {
        // swallow current range
        this.lowerBound = currentRange.lowerBound;
        parentOfCurrentRange.rightRange = currentRange.leftRange;
      }
    }

  }

  private mergeWithFirstOverlappingInLowerBound(): void {

    if (!this.rightRange) {
      // extending bottom range doesn't require merging other ranges
      return;
    }

    if (this.hasAdjacentRangeInRight(this.rightRange)) {
      this.joinRight();
    } else {
      let currentRange = this.rightRange;
      let parentOfCurrentRange;

      while (currentRange && !this.hasOverlappingOrAdjacentRangeInRight(currentRange)) {
        parentOfCurrentRange = currentRange;
        currentRange = currentRange.leftRange;
      }

      // make sure parent is set to current if no traversal has happened
      if (!parentOfCurrentRange) {
        parentOfCurrentRange = this;
      }

      if (currentRange) {
        // swallow current range
        this.upperBound = currentRange.upperBound;
        parentOfCurrentRange.leftRange = currentRange.rightRange;
      }
    }
  }


  getCurrentNodeIds(key: string): Set<FunkyNodeId> {
    const nodeIds = new Set<FunkyNodeId>();
    for (let i = this.lowerBound; i <= this.upperBound; i++) {
      nodeIds.add(new FunkyNodeId(key, i));
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
export class FunkyNodesTreeStorage extends FunkyNodesStorage {

  root: Range;

  add(elem: number): void {
    this.root = this.addElem(elem, this.root);
  }

  addAll(other: FunkyNodesTreeStorage): void {
    // while iterating on 2nd tree, add ranges to first tree
    other.addRangesWhileIteratingInPreOrder(other.root, this);
  }

  private addRangesWhileIteratingInPreOrder(currentRange: Range, originalStorage: FunkyNodesTreeStorage): void {
    if (!currentRange) {
      return;
    }

    // make a copy before adding the range, to avoid copying left/right ranges as well
    originalStorage.addRange(new Range(currentRange.lowerBound, currentRange.upperBound));

    if (currentRange.leftRange) {
      this.addRangesWhileIteratingInPreOrder(currentRange.leftRange, originalStorage);
    }

    if (currentRange.rightRange) {
      this.addRangesWhileIteratingInPreOrder(currentRange.rightRange, originalStorage);
    }
  }

  getAllNodeIds(): Set<FunkyNodeId> {
    const allNodes = new Set<FunkyNodeId>();
    this.inOrderTreeIteration(this.root, allNodes);
    return allNodes;
  }


  private inOrderTreeIteration(currentRange: Range, nodeIds: Set<FunkyNodeId>): Set<FunkyNodeId> {
    if (!currentRange) {
      return new Set();
    }

    if (currentRange.leftRange) {
      this.inOrderTreeIteration(currentRange.leftRange, nodeIds);
    }

    this.setAddAll(nodeIds, currentRange.getCurrentNodeIds(this.key));

    if (currentRange.rightRange) {
      this.inOrderTreeIteration(currentRange.rightRange, nodeIds);
    }
  }

  private setAddAll(nodeIds1: Set<FunkyNodeId>, nodeIds2: Set<FunkyNodeId>): void {
    nodeIds2.forEach((nodeId) => {
      nodeIds1.add(nodeId);
    });
  }

  private addElem(elem: number, currentRange: Range): Range {

    if (!currentRange) {
      // we reached bottom, thus we create a range of 1 element (elem,elem) with no children
      return new Range(elem);
    }

    if (elem < currentRange.lowerBound) {
      if (currentRange.hasNeighbourInLeft(elem)) {
        // extend range and possibly join with left neighbour
        currentRange.decrementLowerBound();
      } else {
        currentRange.leftRange = this.addElem(elem, currentRange.leftRange);
      }

    } else if (elem > currentRange.upperBound) {
      if (currentRange.hasNeighbourInRight(elem)) {
        // extend range and possibly join with right neighbour
        currentRange.incrementUpperBound();
      } else {
        currentRange.rightRange = this.addElem(elem, currentRange.rightRange);
      }
    }

    return currentRange;
  }

  private addRange(rangeToAdd: Range): void {
    if (!this.root) {
      this.root = rangeToAdd;
    } else {
      this._addRange(rangeToAdd, this.root);
    }
  }

  private _addRange(rangeToAdd: Range, currentRange: Range): void {
    if (!rangeToAdd) {
      // no need to add empty ranges;
      return;
    }
    if (currentRange.contains(rangeToAdd)) {
      // range already added
      return;
    }

    if (currentRange.hasOverlappingOrAdjacentRangeInLeft(rangeToAdd) || currentRange.hasOverlappingOrAdjacentRangeInRight(rangeToAdd)) {
      if (currentRange.hasOverlappingOrAdjacentRangeInLeft(rangeToAdd)) {
        currentRange.extendLowerBound(rangeToAdd.lowerBound);
      }
      if (currentRange.hasOverlappingOrAdjacentRangeInRight(rangeToAdd)) {
        currentRange.extendUpperBound(rangeToAdd.upperBound)

      }
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
