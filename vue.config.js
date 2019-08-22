module.exports = {
  // ...other vue-cli plugin options...
  pwa: {
    name: 'Lista della Spesa',
    themeColor: '#01a3e1',
    msTileColor: '#0C7DAF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxOptions: {
      importWorkboxFrom: 'local',
      offlineGoogleAnalytics: true,
      skipWaiting: true,
    }
  }
}
