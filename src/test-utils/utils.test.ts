// __tests__/utils.test.ts
import { add } from './utils';

describe('add function', () => {
  it('should add two numbers correctly', () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });

  it('should return a negative number when adding a positive and negative number', () => {
    const result = add(2, -3);
    expect(result).toBe(-1);
  });

  it('should return 0 when adding two zeros', () => {
    const result = add(0, 0);
    expect(result).toBe(0);
  });
});
