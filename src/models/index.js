import cls from 'cls-hooked';
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

Sequelize.useCLS(cls.createNamespace('simple-book-lib'));

const db = new Sequelize(process.env.DB_URL,
  {
    dialect: 'postgres',
    define: {
      underscoredAll: true,
    },
    logging: process.env.NODE_ENV != 'production' ? console.log : false,
  });

const models = {};

fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
}).forEach(file => {
  const model = require(path.join(__dirname, file))(db);
  // convert model name from snake to pascal to easily identify model name
  const modelName = model.name[0].toUpperCase() + model.name.replace(/_([a-z])/g, function (_, str) {
    return str.toUpperCase();
  }).slice(1);
  models[modelName] = model;
});

Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  db,
  ...models
};