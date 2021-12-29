import { Dependency } from './dependency';

export class Application {
  name: string;
  version: string;
  dependencies: Array<Dependency>;

  constructor(name: string, version: string, dependencies: Array<Dependency>) {
    this.name = name;
    this.version = version;
    this.dependencies = dependencies;
  }
}
