module.exports = app => {

  var cs = {};
  var controllers = [
    'admin',
    'urls',
  ];

  controllers.forEach(controller => {
    cs[controller] = require(`${__dirname}/${controller}`)(app);
  });

  return cs;

};
