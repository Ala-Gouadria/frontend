module.exports = {
  apps: [
    {
      name: 'nora-frontend',
      script: 'serve',
      args: '-s dist -l 8080 --no-clipboard',
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
}
