import glob from 'glob';
import fs from 'fs';

import { getDotnetCoreDependencies } from '../src/dotnetCoreDependencyGetter';
import { Application } from '../src/types/application';
import { Dependency } from '../src/types/dependency';

describe('dotnetCoreDependencyGetter tests', () => {
  const workingDirectory = 'test-working-directory';

  test('looking for dependencies it should use correct pattern', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');

    // act
    getDotnetCoreDependencies(workingDirectory);

    // assert
    expect(globSync).toBeCalledWith(`${workingDirectory}/**/*.deps.json`)
  });

  test('no deps.json file found should return empty list of dependencies', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');
    globSync.mockReturnValue([]);

    // act
    const dependencies = getDotnetCoreDependencies(workingDirectory);

    // assert
    expect(dependencies).toStrictEqual([]);
  });

  describe('deps.json file is present', () => {
    let dependencies = Array<Application>();

    describe('application members', () => {

      beforeEach(() => {
        // arrange
        const globSync = jest.spyOn(glob, 'sync');
        globSync.mockReturnValue(['c:/folder_path/application-name.deps.json']);

        const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
        fsReadFileSync.mockReturnValue(
          JSON.stringify({
            'targets': {
              '.NETCoreApp,Version=v3.1': { }
            }
          })
        );

        // act
        dependencies = getDotnetCoreDependencies(workingDirectory);
      });

      test('should return as many applications as files', () => {
        // assert
        expect(dependencies.length).toEqual(1);
      });

      test('should use file name as application name and first entry in target as application version', () => {
        // assert
        expect(dependencies[0]).toEqual(new Application('application-name', '.NETCoreApp,Version=v3.1', Array<Dependency>()));
      });
    });

    describe('direct dependencies', () => {
      beforeEach(() => {
        // arrange
        const globSync = jest.spyOn(glob, 'sync');
        globSync.mockReturnValue(['c:/folder_path/application-name.deps.json']);

        const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
        fsReadFileSync.mockReturnValue(
          JSON.stringify({
            'targets': {
              '.NETCoreApp,Version=v3.1': {
                'TennisKata.Tests/1.0.0': {},
                'coverlet.collector/1.2.0': {},
                'FluentAssertions/6.2.0': {}
              }
            }
          })
        );

        // act
        dependencies = getDotnetCoreDependencies(workingDirectory);
      });

      test('should use get dependencies from dependencies section', () => {
        // assert
        expect(dependencies[0].dependencies.length).toEqual(3);
        expect(dependencies[0].dependencies[0]).toEqual(
          expect.objectContaining({
            'name': 'TennisKata.Tests',
            'version': '1.0.0',
            'isDev': false
          })
        );
        expect(dependencies[0].dependencies[1]).toEqual(
          expect.objectContaining({
            'name': 'coverlet.collector',
            'version': '1.2.0',
            'isDev': false
          })
        );
        expect(dependencies[0].dependencies[2]).toEqual(
          expect.objectContaining({
            'name': 'FluentAssertions',
            'version': '6.2.0',
            'isDev': false
          })
        );
      });
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
            'targets': {
              '.NETCoreApp,Version=v3.1': {
                'TennisKata.Tests/1.0.0': {
                  'dependencies': {
                    'FluentAssertions': '6.2.0',
                    'MSTest.TestAdapter': '2.1.0'
                  }
                }
              }
            }
          })
        );

        // act
        innerDependencies = getDotnetCoreDependencies(workingDirectory)[0].dependencies[0].dependencies;
      });

      test('should return inner dependencies', () => {
        // assert
        expect(innerDependencies).toEqual(
          [
            {
              'name': 'FluentAssertions',
              'version': '6.2.0',
              'isDev': false,
              'dependencies': []
            },
            {
              'name': 'MSTest.TestAdapter',
              'version': '2.1.0',
              'isDev': false,
              'dependencies': []
            }
          ]
        );
      })
    });
  });
});
