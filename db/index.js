const Sequelize = require('sequelize');

module.exports = new Sequelize('alura_ember', 'postgres', null, {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
