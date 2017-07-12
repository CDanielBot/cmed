import {FunkyNodesStorage} from './funky-nodes.model';
import {FunkyNodesTreeStorage} from './funky-nodes.strategy.range';

export class FunkyNodesFactory {

  static get(): FunkyNodesStorage {
    return new FunkyNodesTreeStorage();
  }
}
