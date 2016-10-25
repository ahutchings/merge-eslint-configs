import path from 'path'
import {assign, merge} from 'lodash/fp'
import relative from 'require-relative'

const emptyConfig = normalizeConfig({})

export default function inlineRootConfigAtPath (configPath) {
  const resolvedPath = resolveConfig(configPath)
  const config = requireConfig(resolvedPath)
  const cwd = path.dirname(resolvedPath)

  return inlineConfigAtPath(config, cwd)
}

function inlineConfigAtPath (config, cwd) {
  if (config.extends.length === 0 && config.plugins.length === 0) return config

  return [
    ...mapExtends(extendsPath => inlineExtendsPathAtPath(extendsPath, cwd), config.extends),
    ...config.plugins.map(pluginPath => inlinePluginPathAtPath(pluginPath, cwd)),
    {
      ...config,
      plugins: [],
      extends: []
    }
  ].reduce(mergeConfigs, emptyConfig)
}

function mapExtends (iteratee, collection) {
  return (Array.isArray(collection) ? collection : [collection]).map(iteratee)
}

function inlineExtendsPathAtPath (extendsPath, cwd) {
  const normalizedPath = normalizeExtendsName(extendsPath)
  const resolvedPath = resolveConfig(normalizedPath, cwd)
  const config = requireConfig(normalizedPath, cwd)
  const extendsCwd = path.dirname(resolvedPath)
  return inlineConfigAtPath(config, extendsCwd)
}

function inlinePluginPathAtPath (pluginPath, cwd) {
  const config = requireConfig(normalizePluginName(pluginPath), cwd)
  const pluginCwd = path.join(cwd, pluginPath)
  return inlineConfigAtPath(config, pluginCwd)
}

function requireConfig (configPath, relativeTo) {
  const config = relativeTo ? relative(configPath, relativeTo) : require(configPath)
  return normalizeConfig(config)
}

function resolveConfig (configPath, relativeTo) {
  return relativeTo ? relative.resolve(configPath, relativeTo) : require.resolve(configPath)
}

function mergeConfigs (configA, configB) {
  return {
    ...configA,
    ...configB,
    env: assign(configA.env, configB.env),
    rules: assign(configA.rules, configB.rules),
    settings: assign(configA.settings, configB.settings),
    parserOptions: merge(configA.parserOptions, configB.parserOptions)
  }
}

const defaultParserOptions = {
  ecmaFeatures: {}
}

function normalizeConfig (config) {
  return {
    ...config,
    env: config.env || {},
    extends: config.extends || [],
    plugins: config.plugins || [],
    rules: config.rules || {},
    settings: config.settings || {},
    parserOptions: merge(defaultParserOptions, config.parserOptions)
  }
}

function normalizeExtendsName (extendsName) {
  if (isRelativePath(extendsName) || path.isAbsolute(extendsName)) return extendsName
  if (extendsName.startsWith('eslint-config-')) return extendsName
  return `eslint-config-${extendsName}`
}

function normalizePluginName (pluginName) {
  if (pluginName.startsWith('eslint-plugin-')) return pluginName
  return `eslint-plugin-${pluginName}`
}

function isRelativePath (path) {
  return path.startsWith('./')
}
