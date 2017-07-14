import {TestBed, async} from '@angular/core/testing';

import {FunkyNodesComponent} from './funky-nodes.component';
import {FormsModule} from '@angular/forms';

describe('FunkyNodesComponent', () => {

  let component;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        FunkyNodesComponent
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(FunkyNodesComponent);
    component = fixture.componentInstance;
  });

  var mergeAndExpectToEqual = function(expected){

    component.onMergeData();

    expect(component.data.getResultOfMerge()).toEqual(expected);
  };

  it('should merge small ranges', () => {

    // setup
    component.data.setFirstRange('a/1, a/2, a/3, a/4, a/128, a/129, b/65, b/66, c/1, c/10, c/42');
    component.data.setSecondRange('a/1, a/2, a/3, a/4, a/5, a/126, a/127, b/100, c/2, c/3, d/1');

    mergeAndExpectToEqual('a/1 a/2 a/3 a/4 a/5 a/126 a/127 a/128 a/129 b/65 b/66 b/100 c/1 c/2 c/3 c/10 c/42 d/1');
  });

  it('should merge empty ranges', () => {
    // setup
    component.data.setFirstRange('');
    component.data.setSecondRange('');

    mergeAndExpectToEqual('');
  });

  it('should merge one range with an empty range', () => {
    // setup
    component.data.setFirstRange('d/2, d/3, d/4');
    component.data.setSecondRange('');

    mergeAndExpectToEqual('d/2 d/3 d/4');
  });

  it('should merge one empty range with a range', () => {
    // setup
    component.data.setFirstRange('');
    component.data.setSecondRange('d/2, d/3, d/4');

    mergeAndExpectToEqual('d/2 d/3 d/4');
  });

  it('should merge 2 ranges when keys are words', () => {
    component.data.setFirstRange('daniel/24, daniel/25, daniel/26');
    component.data.setSecondRange('daniel/29, daniel/28, daniel/27');

    mergeAndExpectToEqual('daniel/24 daniel/25 daniel/26 daniel/27 daniel/28 daniel/29');
  });

  it('should merge 2 ranges when keys are numeric', () => {
    component.data.setFirstRange('11/99, 11/100, 11/101');
    component.data.setSecondRange('11/98, 11/99, 11/100, 11/101, 11/102');

    mergeAndExpectToEqual('11/98 11/99 11/100 11/101 11/102');
  });

  it('should merge identical ranges', () => {
    component.data.setFirstRange('id/32, id/16, id/8');
    component.data.setSecondRange('id/32, id/16, id/8');

    mergeAndExpectToEqual('id/8 id/16 id/32');
  });

  it('should merge overlapping ranges in lower bound', () => {
    component.data.setFirstRange('t/4, t/5, t/6, t/11, t/12, t/13');
    component.data.setSecondRange('t/9, t/8, t/11, t/12, t/10');

    mergeAndExpectToEqual('t/4 t/5 t/6 t/8 t/9 t/10 t/11 t/12 t/13');
  });

  it('should merge overlapping ranges in upper bound', () => {
    component.data.setFirstRange('t/4, t/5, t/11, t/12, t/13');
    component.data.setSecondRange('t/9, t/13, t/14');

    mergeAndExpectToEqual('t/4 t/5 t/9 t/11 t/12 t/13 t/14');
  });

  it('should merge adjacent ranges', () => {
    component.data.setFirstRange('t/11, t/12, t/13, t/5, t/6, t/20, t/21, t/22, t/2, t/1');
    component.data.setSecondRange('t/4, t/3, t/25, t/23, t/24');

    mergeAndExpectToEqual('t/1 t/2 t/3 t/4 t/5 t/6 t/11 t/12 t/13 t/20 t/21 t/22 t/23 t/24 t/25');
  });


});
