import path from 'path'
import relative from 'require-relative'

const emptyConfig = normalizeConfig({})

export default function inlineRootConfigAtPath(configPath) {
  const resolvedPath = resolveConfig(configPath)
  const config = requireConfig(resolvedPath)
  const cwd = path.dirname(resolvedPath)

  return inlineConfigAtPath(config, cwd)
}

function inlineConfigAtPath(config, cwd) {
  if (config.extends.length === 0 && config.plugins.length === 0) return config

  return [
    ...config.extends.map(extendsPath => inlineExtendsPathAtPath(extendsPath, cwd)),
    ...config.plugins.map(pluginPath => inlinePluginPathAtPath(pluginPath, cwd)),
    {
      ...config,
      plugins: [],
      extends: []
    }
  ].reduce(merge, emptyConfig)
}

function inlineExtendsPathAtPath(extendsPath, cwd) {
  const config = requireConfig(normalizeExtendsName(extendsPath), cwd)
  const extendsCwd = path.join(cwd, extendsPath)
  return inlineConfigAtPath(config, extendsCwd)
}

function inlinePluginPathAtPath(pluginPath, cwd) {
  const config = requireConfig(normalizePluginName(pluginPath), cwd)
  const pluginCwd = path.join(cwd, pluginPath)
  return inlineConfigAtPath(config, pluginCwd)
}

function requireConfig(configPath, relativeTo) {
  const config = relativeTo ? relative(configPath, relativeTo) : require(configPath)
  return normalizeConfig(config)
}

function resolveConfig(configPath, relativeTo) {
  return relativeTo ? relative.resolve(configPath, relativeTo) : require.resolve(configPath);
}

function merge (configA, configB) {
  if (!(mergeable(configA) && mergeable(configB))) {
    throw new Error('Cannot merge configs with extends or plugins' + JSON.stringify(configA) + JSON.stringify(configB))
  }

  return {
    ...configA,
    ...configB,
    env: mergeEnvs(configA.env, configB.env),
    rules: mergeRules(configA.rules, configB.rules)
  }
}

function mergeable(config) {
  return config.extends.length === 0 && config.plugins.length === 0;
}

function mergeEnvs (envA, envB) {
  return {
    ...envA,
    ...envB
  }
}

function mergeRules (rulesA, rulesB) {
  return {
    ...rulesA,
    ...rulesB
  }
}

function normalizeConfig (config) {
  return {
    ...config,
    env: config.env || {},
    extends: config.extends || [],
    plugins: config.plugins || [],
    rules: config.rules || {}
  }
}

function normalizeExtendsName (extendsName) {
  if (isRelativePath(extendsName)) return extendsName
  if (extendsName.startsWith('eslint-config-')) return extendsName
  return `eslint-config-${extendsName}`
}

function normalizePluginName (pluginName) {
  if (pluginName.startsWith('eslint-plugin-')) return pluginName
  return `eslint-plugin-${pluginName}`
}

function isRelativePath(path) {
  return path.startsWith('./')
}
