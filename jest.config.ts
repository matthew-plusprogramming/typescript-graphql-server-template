import { pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

export default {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // This enables us to use tsconfig-paths with jest
  modulePaths: [ compilerOptions.baseUrl ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths)
};
