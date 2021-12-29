import { getDotnetCoreDependencies } from '../index';
import { getDotnetDependencies } from '../index';
import { getNpmDependencies } from '../index';

describe('index tests', () => {
  test('imports are successful', () => {
    expect(getDotnetCoreDependencies).toBeDefined();
    expect(getDotnetDependencies).toBeDefined();
    expect(getNpmDependencies).toBeDefined();
  });
});
