import glob from 'glob';
import fs from 'fs';

import { Application } from './types/application';
import { Dependency  } from './types/dependency';

export function getNpmDependencies(workingDirectory: string): Array<Application> {
  const dependencies: Array<Application> = Array<Application>();

  const npmDependencyFiles = glob.sync(`${workingDirectory}/**/package-lock.json`, {ignore: [`**/node_modules/**`]});
  npmDependencyFiles.forEach(file => {
    const packageJsonData = JSON.parse(fs.readFileSync(file).toString());
    const applicationName = packageJsonData['name'];
    const applicationVersion = packageJsonData['version'];

    const application : Application = {
      'name': applicationName,
      'version': applicationVersion,
      'dependencies': Array<Dependency>()
    };

    const dependenciesJson = packageJsonData['dependencies'];
    const dependencyKeys = Object.keys(dependenciesJson);
    dependencyKeys.forEach(dependencyKey => {
      const dependencyJson = dependenciesJson[dependencyKey];
      const dependency : Dependency = {
        'name': dependencyKey,
        'version': dependencyJson['version'],
        'isDev': dependencyJson['dev'] ?? false,
        'dependencies': Array<Dependency>()
      };
      if (Object.keys(dependencyJson).includes('dependencies')) {
        const innerDependencies = Object.keys(dependencyJson['dependencies']);
        innerDependencies.forEach(innerDependency => {
          dependency['dependencies'].push({
            'name': innerDependency,
            'version': dependencyJson['dependencies'][innerDependency]['version'],
            'isDev': dependencyJson['dependencies'][innerDependency]['dev'] ?? false,
            'dependencies': Array<Dependency>()
          });
        });
      }

      application['dependencies'].push(dependency);
    });

    dependencies.push(application);
  });

  return dependencies;
}
