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
  private funkyNodesSet = new FunkyNodesSet();

  onStoreData(): void {
    console.log('storing data: ' + this.data.rawNodes1);
    const splitedArray = this.data.rawNodes1.split(' ');

    for (const elem of splitedArray) {
      const nodeId = this.validateElement(elem);
      this.funkyNodesSet.add(nodeId);
    }

    this.data.result = this.funkyNodesSet.toString();
  }

  private validateElement(elem: string): FunkyNodeId {
    const splitElem = elem.split('/');
    return new FunkyNodeId(splitElem[0], Number(splitElem[1]));
  }

}

export class Data {
  rawNodes1: string;
  rawNodes2: string;
  result: string;
}
