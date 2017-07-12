import {FunkyNodesStorage} from './funky-nodes.strategy.generic';
import {FunkyNodesTreeStorage} from './funky-nodes.strategy.range';

export class FunkyNodesFactory {

  static get(key: string): FunkyNodesStorage {
    return new FunkyNodesTreeStorage(key);
  }
}
