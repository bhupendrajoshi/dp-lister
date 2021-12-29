import glob from 'glob';
import fs from 'fs';

import { getNpmDependencies } from '../src/npmDependencyGetter';
import { Application } from '../src/types/application';
import { Dependency } from '../src/types/dependency';

describe('npmDependencyGetter tests', () => {
  const workingDirectory = 'test-working-directory';

  test('looking for dependencies it should use correct pattern', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');

    // act
    getNpmDependencies(workingDirectory);

    // assert
    expect(globSync).toBeCalledWith(`${workingDirectory}/**/package-lock.json`, {ignore: [`**/node_modules/**`], nocomment: true, nonegate: true})
  });

  test('no package-lock.json file found it should return empty list of dependencies', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');
    globSync.mockReturnValue([]);

    // act
    const dependencies = getNpmDependencies(workingDirectory);

    // assert
    expect(dependencies).toStrictEqual([]);
  });

  describe('package-lock.json is present', () => {
    let dependencies = Array<Application>();

    describe('application members', () => {
      beforeEach(() => {
        // arrange
        const globSync = jest.spyOn(glob, 'sync');
        globSync.mockReturnValue(['c:/folder_path/package-lock.json']);

        const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
        fsReadFileSync.mockReturnValue(
          JSON.stringify({
            "name": "client",
            "version": "0.0.0",
            "dependencies": { }
          })
        );

        // act
        dependencies = getNpmDependencies(workingDirectory);
      });
        test('should return as many applications as files', () => {
          // assert
          expect(dependencies.length).toEqual(1);
        });

        test('should use name and version from package-lock.json', () => {
          // assert
          expect(dependencies[0]).toEqual(new Application('client', '0.0.0', Array<Dependency>()));
        })
    });

    describe('direct dependencies', () => {
      beforeEach(() => {
        // arrange
        const globSync = jest.spyOn(glob, 'sync');
        globSync.mockReturnValue(['c:/folder_path/package-lock.json']);

        const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
        fsReadFileSync.mockReturnValue(
          JSON.stringify({
            "name": "client",
            "version": "0.0.0",
            "dependencies": {
              "@angular-devkit/architect": {
                "version": "0.1002.3",
                "dev": true
              },
              "@angular/core": {
                "version": "10.2.5"
              }
            }
          })
        );

        // act
        dependencies = getNpmDependencies(workingDirectory);
      });

      test('should use get dependencies from dependencies section', () => {
        // assert
        expect(dependencies[0].dependencies.length).toEqual(2);
        expect(dependencies[0].dependencies[0]).toEqual(
          expect.objectContaining({
            'name': '@angular-devkit/architect',
            'version': '0.1002.3',
            'isDev': true
          })
        );
        expect(dependencies[0].dependencies[1]).toEqual(
          expect.objectContaining({
            'name': '@angular/core',
            'version': '10.2.5',
            'isDev': false
          })
        );
      })
    });

    describe('inner dependencies', () => {
      let innerDependencies = Array<Dependency>();
      beforeEach(() => {
        // arrange
        const globSync = jest.spyOn(glob, 'sync');
        globSync.mockReturnValue(['c:/folder_path/application-name.deps.json']);

        const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
        fsReadFileSync.mockReturnValue(
          JSON.stringify({
            "name": "client",
            "version": "0.0.0",
            "dependencies": {
              "@angular-devkit/architect": {
                "version": "0.1002.3",
                "dev": true,
                "dependencies": {
                  "rxjs": {
                    "version": "6.6.2",
                    "dev": true,
                  },
                  "@angular/core": {
                    "version": "10.2.5"
                  }
                }
              }
            }
          })
        );

        // act
        innerDependencies = getNpmDependencies(workingDirectory)[0].dependencies[0].dependencies;
      });

      test('should return inner dependencies', () => {

        // assert
        expect(innerDependencies).toEqual(
          [
            new Dependency('rxjs', '6.6.2', true, Array<Dependency>()),
            new Dependency('@angular/core', '10.2.5', false, Array<Dependency>())
          ]
        );
      });
    });
  });
});
