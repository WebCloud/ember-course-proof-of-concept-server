const sequelize = require('../index');
const Sequelize = require('sequelize');
const User = require('./user');

const Todo = sequelize.define('todo', {
  title: Sequelize.STRING,
  'is-done': Sequelize.BOOLEAN,
});
Todo.belongsTo(User);

module.exports = Todo;
