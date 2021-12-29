export class Dependency {
  name: string;
  version: string;
  isDev: boolean;
  dependencies: Array<Dependency>;

  constructor(name: string, version: string, isDev: boolean, dependencies: Array<Dependency>) {
    this.name = name;
    this.version = version;
    this.isDev = isDev;
    this.dependencies = dependencies;
  }
}
