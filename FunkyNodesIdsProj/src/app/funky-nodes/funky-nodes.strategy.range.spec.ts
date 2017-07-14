import {FunkyNodesTreeStorage} from './funky-nodes.strategy.range';

describe('FunkyNodesTreeStorage', () => {


  describe('one tree storage', () => {

    let treeStorage;

    beforeEach(() => {
      treeStorage = new FunkyNodesTreeStorage('t');
    });

    var addElements = function (elementsArray) {
      for (const elem of elementsArray) {
        treeStorage.add(elem);
      }
    };

    var getNodeIds = function () {
      return Array.from(treeStorage.getAllNodeIds());
    };

    var expectIndex = function (element, expected) {
      expect(element.index).toBe(expected);
    };

    it('should store one element', () => {
      addElements([4]);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(1);
      expectIndex(nodeIds[0], 4);
    });

    it('should store adjacent elements', () => {
      addElements([7, 5, 6]);
      const nodeIds = getNodeIds();
      expectIndex(nodeIds[0], 5);
      expectIndex(nodeIds[1], 6);
      expectIndex(nodeIds[2], 7);
    });

    it('should store duplicate elements', () => {
      addElements([7, 5, 6, 5, 6, 6, 5, 7, 7]);
      const nodeIds = getNodeIds();
      expect(nodeIds.length).toBe(3);
      expectIndex(nodeIds[0], 5);
      expectIndex(nodeIds[1], 6);
      expectIndex(nodeIds[2], 7);
    });

  });

  describe('two tree storages', () => {

    let treeStorage1, treeStorage2;

    beforeEach(() => {
      treeStorage1 = new FunkyNodesTreeStorage('t');
      treeStorage2 = new FunkyNodesTreeStorage('t');
    });

  });


});
