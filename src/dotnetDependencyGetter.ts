import glob from 'glob';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';

import { Application } from './types/application';
import { Dependency } from './types/dependency';

export function getDotnetDependencies(workingDirectory: string): Array<Application> {
  const dependencies: Array<Application> = Array<Application>();

  const dotnetNugetDependencyFiles = glob.sync(`${workingDirectory}/**/packages.config`);
  dotnetNugetDependencyFiles.forEach(file => {
    const application : Application = {
      'name': path.basename(path.dirname(file)),
      'version': 'Unknown',
      'dependencies': Array<Dependency>()
    };

    const data = fs.readFileSync(file);
    const parser = new xml2js.Parser();
    parser.parseString(data, function (err: any, result: any) {
      const packageKeys = Object.keys(result.packages.package);
      packageKeys.forEach(packageKey => {
        const packageDetails = result.packages.package[packageKey]['$'];
        application['dependencies'].push({
          'name': packageDetails['id'],
          'version': packageDetails['version'],
          'isDev': false,
          'dependencies': Array<Dependency>()
        });
      });
    });

    dependencies.push(application);
  });

  return dependencies;
}
