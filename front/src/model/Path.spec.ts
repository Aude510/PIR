import {Path} from "./Path";
import {Point} from "./Point";

describe('Path', () => {

  it('contains', () => {
    const p1 = new Path([
      Point.fromTuple(1,2),
      Point.fromTuple(2,2),
      Point.fromTuple(3,2),
      Point.fromTuple(3,3),
      Point.fromTuple(4,4),
    ])
    const p2 = new Path([
      Point.fromTuple(2,2),
      Point.fromTuple(3,2),
      Point.fromTuple(3,3),
      Point.fromTuple(4,4),
    ])
    expect(p1.contains(p2)).toBeTruthy();
  });
});
