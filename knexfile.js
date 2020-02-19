// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './.data/db.dev.sqlite3'
    },
    migrations: {
      directory: './src/db/migrations'
    }
  },

};
