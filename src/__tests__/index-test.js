import path from 'path'
import inline from '../'

it('should inline an empty config', () => {
  const actual = inline(path.join(__dirname, 'fixtures/empty'))
  const expected = {
    env: {},
    extends: [],
    plugins: [],
    rules: {}
  }

  expect(actual).toEqual(expected)
})

it('should inline configs with no overlapping rules', () => {
  const actual = inline(path.join(__dirname, 'fixtures/no-overlapping-rules'))
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
  const actual = inline(path.join(__dirname, 'fixtures/plugin'))
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
  const actual = inline(path.join(__dirname, 'fixtures/plugin-short-name'))
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
  const actual = inline(path.join(__dirname, 'fixtures/env'))
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
  const actual = inline(path.join(__dirname, 'fixtures/extends-module'))
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
  const actual = inline(path.join(__dirname, 'fixtures/extends-module-short-name'))
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

it('should recursively inline modules referenced in extends', () => {
  const actual = inline(path.join(__dirname, 'fixtures/extends-module-recursive'))
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

it('should recursively inline modules referenced in extends with a flattened node_modules', () => {
  const actual = inline(path.join(__dirname, 'fixtures/extends-module-recursive-flattened'))
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

it('should inline an extends value defined as a string', () => {
  const actual = inline(path.join(__dirname, 'fixtures/string-extends'))
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

it('should inline extends values that have been fully resolved', () => {
  const actual = inline(path.join(__dirname, 'fixtures/resolved-extends'))
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
