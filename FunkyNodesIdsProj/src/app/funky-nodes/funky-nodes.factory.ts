import {FunkyNodesBoolArrayStorage} from './funky-nodes.strategy.bool';
import {FunkyNodesStorage} from './funky-nodes.model';

export class FunkyNodesFactory {

  static get(): FunkyNodesStorage {
    return new FunkyNodesBoolArrayStorage();
  }
}
