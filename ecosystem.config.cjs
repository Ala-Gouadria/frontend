module.exports = {
  apps: [
    {
      name: 'nora-frontend',
      script: './server.cjs',
      watch: false,
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: '8080',
        BACKEND_URL: 'http://localhost:3000',
      },
    },
  ],
}
