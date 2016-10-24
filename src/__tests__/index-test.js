import path from 'path';
import inline from '../'

it('should inline an empty config', () => {
  const actual = inline(path.join(__dirname, 'fixtures/empty'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {}
  }

  expect(actual).toEqual(expected)
})

it('should inline configs with no overlapping rules', () => {
  const actual = inline(path.join(__dirname, 'fixtures/no-overlapping-rules'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {
      'no-cond-assign': 'error',
      'no-console': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should inline a plugin', () => {
  const actual = inline(path.join(__dirname, 'fixtures/plugin'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should inline a plugin with short name', () => {
  const actual = inline(path.join(__dirname, 'fixtures/plugin-short-name'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should merge env', () => {
  const actual = inline(path.join(__dirname, 'fixtures/env'));
  const expected = {
    env: {
      node: true,
      es6: false,
      mocha: true
    },
    extends: [],
    plugins: [],
    rules: {}
  }

  expect(actual).toEqual(expected)
})

it('should inline a module referenced in extends', () => {
  const actual = inline(path.join(__dirname, 'fixtures/extends-module'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should inline a module referenced in extends using a short name', () => {
  const actual = inline(path.join(__dirname, 'fixtures/extends-module-short-name'));
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})