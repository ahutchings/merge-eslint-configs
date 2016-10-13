import omit from 'lodash/omit'

export default function merge (config1, config2) {
  const inlinedConfig1 = inlineConfig(normalizeConfig(config1))
  const inlinedConfig2 = inlineConfig(normalizeConfig(config2))

  return {
    ...inlinedConfig1,
    ...inlinedConfig2,
    rules: mergeRules(inlinedConfig1.rules, inlinedConfig2.rules)
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

function mergeRules (rules1, rules2) {
  return {
    ...rules1,
    ...rules2
  }
}

function normalizeConfig (config) {
  return {
    ...config,
    plugins: config.plugins || [],
    rules: config.rules || {}
  }
}

function normalizePluginName (pluginName) {
  if (pluginName.startsWith('eslint-plugin-')) return pluginName
  return `eslint-plugin-${pluginName}`
}
