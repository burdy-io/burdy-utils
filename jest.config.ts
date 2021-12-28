import type {Config} from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    testPathIgnorePatterns: [
      '/node_modules/',
      '(/__tests__/.*|(\\.|/)(test|spec))\\.d\.ts$'
    ],
    globals: {
      'ts-jest': {
        isolatedModules: true,
      },
    },
  };
};
