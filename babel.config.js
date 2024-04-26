module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: false,
        modules: false,
      }
    ]
  ],
  plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: 3,
      }
    ]
  ]
}
