import {FunkyNodesTreeStorage} from './funky-nodes.strategy.range';

describe('FunkyNodesTreeStorage', () => {

  let treeStorage1, treeStorage2;

  var addElementsTo1 = function (elementsArray) {
    for (const elem of elementsArray) {
      treeStorage1.add(elem);
    }
  };

  var getNodeIds = function () {
    return Array.from(treeStorage1.getAllNodeIds());
  };

  var expectIndex = function (element, expected) {
    expect(element.index).toBe(expected);
  };

  describe('one tree storage', () => {

    beforeEach(() => {
      treeStorage1 = new FunkyNodesTreeStorage('t');
    });

    it('should store one element', () => {
      addElementsTo1([4]);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(1);
      expectIndex(nodeIds[0], 4);
    });

    it('should store adjacent elements', () => {
      addElementsTo1([7, 5, 6]);
      const nodeIds = getNodeIds();
      expectIndex(nodeIds[0], 5);
      expectIndex(nodeIds[1], 6);
      expectIndex(nodeIds[2], 7);
    });

    it('should store duplicate elements', () => {
      addElementsTo1([7, 5, 6, 5, 6, 6, 5, 7, 7]);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(3);
      expectIndex(nodeIds[0], 5);
      expectIndex(nodeIds[1], 6);
      expectIndex(nodeIds[2], 7);
    });

    it('should store consecutive CRESC numbers', () => {
      const length = 99999;
      const elements = [];
      for (let i = 1; i <= length; i++) {
        elements.push(i);
      }

      addElementsTo1(elements);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(length);
      expectIndex(nodeIds[0], 1);
      expectIndex(nodeIds[length - 1], length);
    });

    it('should store consecutive DESC numbers', () => {
      const length = 99999;
      const elements = [];
      for (let i = length; i >= 1; i--) {
        elements.push(i);
      }

      addElementsTo1(elements);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(length);
      expectIndex(nodeIds[0], 1);
      expectIndex(nodeIds[length - 1], length);
    });

    it('should store somewhat random numbers', () => {
      const length = 200000;
      const elements = [];
      for (let i = length / 2; i <= length; i++) {
        elements.push(i);
      }
      for (let i = 1; i < length / 2; i++) {
        elements.push(i);
      }

      addElementsTo1(elements);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(length);
      expectIndex(nodeIds[0], 1);
      expectIndex(nodeIds[length - 1], length);
    });

  });

  describe('two tree storages', () => {

    var addElementsTo2 = function (elementsArray) {
      for (const elem of elementsArray) {
        treeStorage2.add(elem);
      }
    };

    var mergeRanges = function () {
      treeStorage1.addAll(treeStorage2);
      return getNodeIds();
    };

    beforeEach(() => {
      treeStorage1 = new FunkyNodesTreeStorage('t');
      treeStorage2 = new FunkyNodesTreeStorage('t');
    });

    it('should merge two overlapping ranges', () => {
      addElementsTo1([5, 4, 6]);
      addElementsTo2([8, 7, 6, 5]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(5);
      expectIndex(nodeIds[0], 4);
      expectIndex(nodeIds[4], 8);

    });

    it('should merge two overlapping left ranges', () => {
      addElementsTo1([5, 4, 6]);
      addElementsTo2([4, 3, 2]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(5);
      expectIndex(nodeIds[0], 2);
      expectIndex(nodeIds[4], 6);
    });

    it('should merge one contained element range correctly', () => {
      addElementsTo1([5, 4, 6]);
      addElementsTo2([5]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(3);
      expectIndex(nodeIds[0], 4);
      expectIndex(nodeIds[1], 5);
    });

    it('should merge one bound element range correctly', () => {
      addElementsTo1([5, 4, 6]);
      addElementsTo2([6]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(3);
      expectIndex(nodeIds[0], 4);
      expectIndex(nodeIds[2], 6);
    });

    it('should merge one adjacent element range correctly', () => {
      addElementsTo1([5, 4, 6]);
      addElementsTo2([3]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(4);
      expectIndex(nodeIds[0], 3);
      expectIndex(nodeIds[1], 4);
    });

    it('should merge two adjacent ranges', () => {
      addElementsTo1([11, 12, 13]);
      addElementsTo2([16, 15, 14]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(6);
      expectIndex(nodeIds[0], 11);
      expectIndex(nodeIds[5], 16);
    });

    it('should merge non-adjacent ranges', () => {
      addElementsTo1([11, 12, 13, 20, 22, 24]);
      addElementsTo2([16, 15, 21, 23]);

      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(10);
      expectIndex(nodeIds[0], 11);
      expectIndex(nodeIds[8], 23);
      expectIndex(nodeIds[9], 24);
    });

    it('should merge complex ranges', () => {

      addElementsTo1([2, 4, 6, 8, 9, 10, 51, 52, 53, 54, 55, 97, 96, 95]);
      const arr = [];
      for (let i = 200; i <= 400; i++) {
        arr.push(i);
      }
      addElementsTo1(arr);

      addElementsTo2([1, 7, 13, 12, 11, 45, 46, 47, 199, 401]);

      // 1 2 4 [6,13] [45, 47] [51,55] [95,97] [199, 401]
      const nodeIds = mergeRanges();
      expect(nodeIds.length).toBe(225);
      expectIndex(nodeIds[0], 1);
      expectIndex(nodeIds[1], 2);
      expectIndex(nodeIds[3], 6);
      expectIndex(nodeIds[4], 7);
      expectIndex(nodeIds[10], 13);
      expectIndex(nodeIds[11], 45);
      expectIndex(nodeIds[12], 46);
      expectIndex(nodeIds[13], 47);
      expectIndex(nodeIds[14], 51);
      expectIndex(nodeIds[18], 55);
      expectIndex(nodeIds[19], 95);
      expectIndex(nodeIds[21], 97);
      expectIndex(nodeIds[22], 199);
      expectIndex(nodeIds[23], 200);
      expectIndex(nodeIds[222], 399);
      expectIndex(nodeIds[223], 400);
      expectIndex(nodeIds[224], 401);

    });

  });

});
