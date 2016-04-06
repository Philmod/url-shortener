module.exports = app => {

  var ms = {};
  var models = [
    'Url',
  ];

  models.forEach(model => {
    ms[model] = require(`${__dirname}/${model}`)(app);
  });

  return ms;

};
