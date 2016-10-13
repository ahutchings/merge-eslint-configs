import merge from '../'

it('should merge empty configs', () => {
  const actual = merge({}, {})
  const expected = {
    plugins: [],
    rules: {}
  }

  expect(actual).toEqual(expected)
})

it('should merge configs with no overlapping rules', () => {
  const actual = merge({
    rules: {
      'no-cond-assign': 'error'
    }
  }, {
    rules: {
      'no-console': 'error'
    }
  })
  const expected = {
    plugins: [],
    rules: {
      'no-cond-assign': 'error',
      'no-console': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should inline a plugin', () => {
  jest.mock('eslint-plugin-myplugin', () => {
    return {
      rules: {
        'no-cond-assign': 'error'
      }
    }
  }, {virtual: true})

  const actual = merge({
    plugins: [
      'eslint-plugin-myplugin'
    ]
  }, {})
  const expected = {
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})

it('should inline a plugin with short name', () => {
  jest.mock('eslint-plugin-myplugin', () => {
    return {
      rules: {
        'no-cond-assign': 'error'
      }
    }
  }, {virtual: true})

  const actual = merge({
    plugins: [
      'myplugin'
    ]
  }, {})
  const expected = {
    plugins: [],
    rules: {
      'no-cond-assign': 'error'
    }
  }

  expect(actual).toEqual(expected)
})
