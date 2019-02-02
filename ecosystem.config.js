module.exports = {
  apps: [
    {
      name: 'nuxt-dev',
      script: './node_modules/nuxt/bin/nuxt.js',
      cwd: './',
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
}
