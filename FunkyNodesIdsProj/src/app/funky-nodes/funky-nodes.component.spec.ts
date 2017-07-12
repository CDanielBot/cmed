import {TestBed, async} from '@angular/core/testing';

import {FunkyNodesComponent} from './funky-nodes.component';
import {FunkyNodeId, FunkyNodesSet} from './funky-nodes.model';

describe('FunkyNodesComponent', () => {
  let funkyNodesSet;
  beforeEach(() => {
    // TestBed.configureTestingModule({
    //   declarations: [
    //     FunkyNodesComponent
    //   ],
    // }).compileComponents();

    funkyNodesSet = new FunkyNodesSet();
  });

  it('should store one node id', () => {
    const nodeId = new FunkyNodeId('a', 4);
    funkyNodesSet.add(nodeId);
    const set = funkyNodesSet.getEntireSet();
    expect(set.size).toBe(1);
    expect(Array.from(set)[0]).toEqual(nodeId);
  });


});
