
import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesStorage} from './funky-nodes.model';


export class Range {

  lowerBound: number;
  upperBound: number;

  constructor(lowerBound: number, upperBound: number) {
    this.lowerBound = lowerBound;
    this.upperBound = upperBound;
  }
}

// export class FunkyNodesRange implements FunkyNodesStorage {
//
// }
