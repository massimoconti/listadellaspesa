module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? '/listaspesa/'
    : '/',
  // ...other vue-cli plugin options...
  pwa: {
    name: 'Lista della Spesa',
    themeColor: '#01a3e1',
    msTileColor: '#0C7DAF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  }
}
