import {Component} from '@angular/core';
import {FunkyNodeId} from './funky-nodes.model';
import {FunkyNodesSet} from './funky-nodes.model';

@Component({
  selector: 'app-root',
  templateUrl: './funky-nodes.component.html',
  styleUrls: ['./funky-nodes.component.css']
})
export class FunkyNodesComponent {

  data = new Data();

  onStoreData(): void {

    if (this.data.rawNodes1) {
      const funkyNodesSet1 = this.storeData(this.data.rawNodes1);
      this.data.result1 = funkyNodesSet1.toString();
    }
    if (this.data.rawNodes2) {
      const funkyNodesSet2 = this.storeData(this.data.rawNodes2);
      this.data.result2 = funkyNodesSet2.toString();
    }
  }

  onMergeData(): void {

    const funkyNodesSet1 = this.storeData(this.data.rawNodes1);
    const funkyNodesSet2 = this.storeData(this.data.rawNodes2);

    funkyNodesSet1.addAll(funkyNodesSet2);

    this.data.mergedResult = funkyNodesSet1.toString();
  }

  private storeData(data: string): FunkyNodesSet {

    const funkyNodesSet = new FunkyNodesSet();

    for (const elem of data.split(' ')) {
      const nodeId = this.validateElement(elem);
      funkyNodesSet.add(nodeId);
    }

    return funkyNodesSet;
  }


  private validateElement(elem: string): FunkyNodeId {
    const splitElem = elem.split('/');
    return new FunkyNodeId(splitElem[0], Number(splitElem[1]));
  }

}

export class Data {

  rawNodes1: string;
  rawNodes2: string;

  result1: string;
  result2: string;

  mergedResult: string;
}
