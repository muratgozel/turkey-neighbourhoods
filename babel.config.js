module.exports = function(api) {
  const env = api.env()

  const presets = [
    ["@babel/env", {}]
  ]
  const envOpts = {
    useBuiltIns: env == 'development' ? false : 'usage',
    corejs: {version: 3, proposals: true},
    debug: true
  }

  presets.push(['minify', { builtIns: false }])

  presets[0][1] = envOpts

  return {
    presets: presets,
    plugins: []
  }
}
