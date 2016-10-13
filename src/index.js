import omit from 'lodash/omit'

export default function merge (configA, configB) {
  const inlinedConfigA = inlineConfig(normalizeConfig(configA))
  const inlinedConfigB = inlineConfig(normalizeConfig(configB))

  return {
    ...inlinedConfigA,
    ...inlinedConfigB,
    env: mergeEnvs(configA.env, configB.env),
    rules: mergeRules(inlinedConfigA.rules, inlinedConfigB.rules)
  }
}

function inlineConfig (config) {
  if (config.plugins.length === 0) return config

  return [
    ...config.plugins.map(resolvePlugin).map(normalizeConfig).map(inlineConfig),
    omit(config, 'plugins')
  ].reduce(merge, {})
}

function resolvePlugin (pluginName) {
  return require(normalizePluginName(pluginName))
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
    plugins: config.plugins || [],
    rules: config.rules || {}
  }
}

function normalizePluginName (pluginName) {
  if (pluginName.startsWith('eslint-plugin-')) return pluginName
  return `eslint-plugin-${pluginName}`
}
