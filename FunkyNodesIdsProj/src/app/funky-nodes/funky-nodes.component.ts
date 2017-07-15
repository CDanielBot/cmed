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

    for (const elem of data.split(', ')) {
      const nodeId = this.validateElement(elem);
      if (nodeId) {
        funkyNodesSet.add(nodeId);
      } else {
        this.data.addInvalidElement(elem);
      }
    }

    return funkyNodesSet;
  }


  private validateElement(elem: string): FunkyNodeId {

    const splitElem = elem.split('/');

    if (this.isCorrectKey(splitElem[0]) && this.isCorrectValue(splitElem[1])) {
      return new FunkyNodeId(splitElem[0], Number(splitElem[1]));
    }

    console.error('Invalid element: ' + elem + ' . Going to ignore it');
    return null;

  }

  private isCorrectKey(key: string): boolean {
    return key !== undefined && key !== null;
  }

  private isCorrectValue(value: string): boolean {
    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      // Validation failed
      return false;
    } else {
      return parseInt(value) > 0;
    }

  }

}

export class Data {

  rawNodes1: string;
  rawNodes2: string;

  result1: string;
  result2: string;

  invalidElementsArray: Array<string>;
  invalidElements: string;

  mergedResult: string;

  setFirstRange(range1: string): void {
    this.rawNodes1 = range1;
  }

  setSecondRange(range2: string): void {
    this.rawNodes2 = range2;
  }

  getResultOfMerge(): string {
    return this.mergedResult;
  }

  addInvalidElement(elem: string): void {
    if (!this.invalidElementsArray) {
      this.invalidElementsArray = new Array<string>();
    }
    this.invalidElementsArray.push(elem);

    if(!this.invalidElements){
      this.invalidElements = elem;
    }else{
      this.invalidElements += ' ' + elem;
    }

  }

}
