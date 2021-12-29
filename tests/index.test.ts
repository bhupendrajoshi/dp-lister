import { getDotnetCoreDependencies } from '../index';
import { getDotnetDependencies } from '../index';
import { getNpmDependencies } from '../index';
import { Application } from '../index';
import { Dependency } from '../index';

describe('index tests', () => {
  test('imports are successful', () => {
    expect(getDotnetCoreDependencies).toBeDefined();
    expect(getDotnetDependencies).toBeDefined();
    expect(getNpmDependencies).toBeDefined();

    const application : Application = new Application('test', '1.0.0', Array<Dependency>());
    expect(application).toBeInstanceOf(Application);

    const dependency : Dependency = new Dependency('test', '1.0.0', false, Array<Dependency>());
    expect(dependency).toBeInstanceOf(Dependency);
  });
});
