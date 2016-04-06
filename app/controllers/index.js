module.exports = app => {

  var cs = {};
  var controllers = [
    'urls',
  ];

  controllers.forEach(controller => {
    cs[controller] = require(`${__dirname}/${controller}`)(app);
  });

  return cs;

};
