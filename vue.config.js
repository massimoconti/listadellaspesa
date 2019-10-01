module.exports = {
  pwa: {
    name: 'Lista della Spesa',
    themeColor: '#01a3e1',
    msTileColor: '#0C7DAF',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      importWorkboxFrom: 'local',
      swSrc: './src/service-worker.js',
    }
  }
}
