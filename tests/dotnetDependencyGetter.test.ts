import glob from 'glob';
import fs from 'fs';

import { getDotnetDependencies } from '../src/dotnetDependencyGetter';
import { Application } from '../src/types/application';

describe('dotnetDependencyGetter tests', () => {
  const workingDirectory = 'test-working-directory';

  test('looking for dependencies it should use correct pattern', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');

    // act
    getDotnetDependencies(workingDirectory);

    // assert
    expect(globSync).toBeCalledWith(`${workingDirectory}/**/packages.config`)
  });

  test('no packages.config file found it should return empty list of dependencies', () => {
    // arrange
    const globSync = jest.spyOn(glob, 'sync');
    globSync.mockReturnValue([]);

    // act
    const dependencies = getDotnetDependencies(workingDirectory);

    // assert
    expect(dependencies).toStrictEqual([]);
  });

  describe('dependencies are present', () => {
    let dependencies = Array<Application>();
    beforeEach(() => {
      // arrange
      const globSync = jest.spyOn(glob, 'sync');
      globSync.mockReturnValue(['c:/folder_path/application-name/packages.config']);

      const fsReadFileSync = jest.spyOn(fs, 'readFileSync');
      fsReadFileSync.mockReturnValue(
        `<?xml version="1.0" encoding="utf-8"?>
        <packages>
          <package id="Antlr" version="3.5.0.2" targetFramework="net452" />
          <package id="Autofac" version="6.2.0" targetFramework="net48" />
          <package id="Autofac.Mvc5" version="6.0.0" targetFramework="net48" />
        </packages>`
      );

      // act
      dependencies = getDotnetDependencies(workingDirectory);
    });

    test('should return as many applications as files', () => {
      // assert
      expect(dependencies.length).toEqual(1);
    });

    test('should use parent folder name as application name', () => {
      // assert
      expect(dependencies[0].name).toEqual('application-name');
    })

    test('should use Unknown as application version', () => {
      // assert
      expect(dependencies[0].version).toEqual('Unknown');
    })

    test('should use get dependencies from dependencies section', () => {
      // assert
      expect(dependencies[0].dependencies.length).toEqual(3);
      expect(dependencies[0].dependencies[0]).toEqual(
        expect.objectContaining({
          'name': 'Antlr',
          'version': '3.5.0.2',
          'isDev': false
        })
      );
      expect(dependencies[0].dependencies[1]).toEqual(
        expect.objectContaining({
          'name': 'Autofac',
          'version': '6.2.0',
          'isDev': false
        })
      );
      expect(dependencies[0].dependencies[2]).toEqual(
        expect.objectContaining({
          'name': 'Autofac.Mvc5',
          'version': '6.0.0',
          'isDev': false
        })
      );
    })
  });
});
