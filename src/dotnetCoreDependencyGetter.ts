import glob from 'glob';
import fs from 'fs';
import path from 'path';

import { Application } from './types/application';
import { Dependency  } from './types/dependency';

export function getDotnetCoreDependencies(workingDirectory: string): Array<Application> {
  const dependencies: Array<Application> = Array<Application>();

  const dotnetCoreNugetDependencyFiles = glob.sync(`${workingDirectory}/**/*.deps.json`);
  dotnetCoreNugetDependencyFiles.forEach(file => {
    const applicationName = path.basename(file, ".deps.json");
    const dependencyData = JSON.parse(fs.readFileSync(file).toString());
    const applicationTargets = dependencyData["targets"];
    const applicationVersionKey = Object.keys(applicationTargets)[0];
    const applicationTarget = applicationTargets[applicationVersionKey];

    const application : Application = {
      'name': applicationName,
      'version': applicationVersionKey,
      'dependencies': Array<Dependency>()
    };

    const dependencyKeys = Object.keys(applicationTarget);
    dependencyKeys.forEach(dependencyKey => {
      const splits = dependencyKey.split('/');
      const dependencyName = splits[0];
      const dependencyVersion = splits[1];

      const dependency : Dependency = {
        'name': dependencyName,
        'version': dependencyVersion,
        'isDev': false,
        'dependencies': Array<Dependency>()
      };

      if (Object.keys(applicationTarget[dependencyKey]).includes('dependencies')) {
        const innerDependencies = Object.keys(applicationTarget[dependencyKey]['dependencies']);
        innerDependencies.forEach(innerDependency => {
          dependency['dependencies'].push({
            'name': innerDependency,
            'version': applicationTarget[dependencyKey]['dependencies'][innerDependency],
            'isDev': false,
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
