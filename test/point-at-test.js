var tape = require("tape"),
path = require("../");
require("./inDelta");

var properties, xValues, yValues;

tape("getPointAt testing lineTo", function(test) {

  var paths = [{
    path: "M0,50L500,50",
    xValues: [ 0, 100, 200, 300, 400, 500 ],
    yValues: [ 50, 50, 50, 50, 50, 50 ]
  },{
    path: "M0,50L300,300",
    xValues: [ 0, 59.999996185302734, 119.99999237060547, 180, 239.99998474121094, 300 ],
    yValues: [ 50, 100, 150, 200, 249.99998474121094, 300 ]
  },{
    path: "M0,50H300",
    xValues: [ 0, 50, 100, 150, 200, 250, 300 ],
    yValues: [ 50, 50, 50, 50, 50, 50, 50 ]
  },{
    path: "M50,50h300",
    xValues: [ 50, 100, 150, 200, 250, 300, 350 ],
    yValues: [ 50, 50, 50, 50, 50, 50, 50 ]
  },{
    path: "M50,0V200",
    xValues: [ 50, 50, 50, 50, 50, 50, 50 ],
    yValues: [ 0, 33.33333206176758, 66.66666412353516, 100, 133.3333282470703, 166.6666717529297, 200 ]
  },{
    path: "M50,10v200",
    xValues: [ 50, 50, 50, 50, 50, 50, 50 ],
    yValues: [ 10, 43.33333206176758, 76.66666412353516, 110, 143.3333282470703, 176.6666717529297, 210 ]
  },{
    path: "M50,50H300V200H50Z",
    xValues: [ 50, 183.3333282470703, 300, 300, 166.66668701171875, 50, 50 ],
    yValues: [ 50, 50, 66.66665649414062, 200, 200, 183.33331298828125, 50 ]
  }];

  for(var i=0; i< paths.length; i++){
    for(var j=0; j<paths[i].xValues.length; j++){
      properties = path.svgPathProperties(paths[i].path);
      var position = properties.getPointAtLength(j*properties.getLength()/(paths[i].xValues.length-1));
      test.inDelta(position.x, paths[i].xValues[j], 0.1);
      test.inDelta(position.y, paths[i].yValues[j], 0.1);
    }
  }
  test.end();

});

tape("getPointAt testing Cubic Bézier", function(test) {
/*
  var paths = [{
    path: "M200,300 Q400,50 600,300",
    xValues: [ 200, 267.53448486328125, 351.9363098144531, 448.0638732910156, 532.4654541015625, 600 ],
    yValues: [ 300, 229.83480834960938, 182.21913146972656, 182.21926879882812, 229.83482360839844, 300 ]
  }];

  for(var i=0; i< paths.length; i++){
    for(var j=0; j<paths[i].xValues.length; j++){
      properties = path.pathProperties(paths[i].path);
      console.info(j*properties.getLength()/(paths[i].xValues.length-1));
      var position = properties.getPointAt(j*properties.getLength()/(paths[i].xValues.length-1));
      test.inDelta(position.x, paths[i].xValues[j], 0.1);
      test.inDelta(position.y, paths[i].yValues[j], 0.1);
    }
  }*/
  test.end();
/*
  properties = path.pathProperties("M200,300 Q400,50 600,300");
  console.info(1/5);
  console.info(properties.getPointAt(0));
  console.info(properties.getPointAt(0.20 * properties.getLength()));
  console.info(properties.getPointAt(0.8 * properties.getLength()));
  */

});
/*




tape("Testing Cubic Bézier", function(test) {

  //C & c
  var properties = path.pathProperties("M0,100 Q50,-50 100,100 T200,100 T300,100");
  console.info(properties.getPointAt(0.1 * properties.getLength()));
  console.info("*****");
  console.info(properties.getPointAt(0.5 * properties.getLength()));


  //test.inDelta(properties.getLength(), 213.8, 0.1);


  properties = path.pathProperties("m100,25c-90,65,10,75,50,170");
  test.inDelta(properties.getLength(), 213.8, 0.1);


  //S & s
  properties = path.pathProperties("M100,200 C100,100 250,100 250,200 S400,300 400,200");
  test.inDelta(properties.getLength(), 475.746, 0.1);

  properties = path.pathProperties("M100,200 c0,-100 150,-100 150,0 s150,100 150,0");
  test.inDelta(properties.getLength(), 475.746, 0.1);

  //S & s without previous C or c
  properties = path.pathProperties("M100,200 S400,300 400,200");
  test.inDelta(properties.getLength(), 327.9618, 0.1);

  properties = path.pathProperties("M100,200 s300,100 300,0");
  test.inDelta(properties.getLength(), 327.9618, 0.1);

  test.end();

});*/
