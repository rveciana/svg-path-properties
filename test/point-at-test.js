var tape = require("tape"),
path = require("../");
require("./inDelta");

var properties;

tape("getPointAtLength testing lineTo", function(test) {

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
      var position = properties.getPointAtLength(j*properties.getTotalLength()/(paths[i].xValues.length-1));
      test.inDelta(position.x, paths[i].xValues[j], 0.1);
      test.inDelta(position.y, paths[i].yValues[j], 0.1);
    }
    test.deepEqual(properties.getPointAtLength(10000000), properties.getPointAtLength(properties.getTotalLength()));
    test.deepEqual(properties.getPointAtLength(-1), properties.getPointAtLength(0));
  }

  test.end();

});

tape("getPointAtLength testing Quadratic Bézier", function(test) {
  var paths = [{
    path: "M200,300 Q400,50 600,300",
    xValues: [ 200, 255.24655151367188, 321.72381591796875, 400.0000305175781, 478.2762756347656, 544.75341796875, 600 ],
    yValues: [ 300, 240.47999572753906, 194.14747619628906, 175.0000762939453, 194.1474609375, 240.47999572753906, 300 ]
  },
  {
    path: "M0,100 Q50,-50 100,100 T200,100",
    xValues: [ 0, 25.60834312438965, 74.3916015625, 99.99996948242188, 125.60824584960938, 174.39163208007812, 200 ],
    yValues: [ 100, 42.84862518310547, 42.84857940673828, 99.99991607666016, 157.15122985839844, 157.15139770507812, 100 ]
  },
  {
    path: "M0,100 q50,-150 100,0 t100,0",
    xValues: [ 0, 25.60834312438965, 74.3916015625, 99.99996948242188, 125.60824584960938, 174.39163208007812, 200 ],
    yValues: [ 100, 42.84862518310547, 42.84857940673828, 99.99991607666016, 157.15122985839844, 157.15139770507812, 100 ]
  },
  {
    path: "M0,100 T200,100",
    xValues: [ 0, 33.33333206176758, 66.66666412353516, 100, 133.3333282470703, 166.6666717529297, 200 ],
    yValues: [ 100, 100, 100, 100, 100, 100, 100 ]
  },
  {
    path: "M0,100 Q50,-50 100,100 T200,100 T300,100",
    xValues: [ 0, 50.00000762939453, 99.99998474121094, 149.9999542236328, 200.0000457763672, 250.00059509277344, 300 ],
    yValues: [ 100, 25.000080108642578, 99.99996185302734, 174.9999237060547, 99.99983978271484, 25.00008201599121, 100 ]
  }];

  for(var i=0; i< paths.length; i++){
    for(var j=0; j<paths[i].xValues.length; j++){
      properties = path.svgPathProperties(paths[i].path);
      var position = properties.getPointAtLength(j*properties.getTotalLength()/(paths[i].xValues.length-1));
      test.inDelta(position.x, paths[i].xValues[j], 1);
      test.inDelta(position.y, paths[i].yValues[j], 1);
    }
    test.deepEqual(properties.getPointAtLength(10000000), properties.getPointAtLength(properties.getTotalLength()));
    test.deepEqual(properties.getPointAtLength(-1), properties.getPointAtLength(0));
  }
  test.end();
});

tape("getPointAtLength testing Cubic Bézier", function(test) {
  var paths = [{
    path: "M200,200 C275,100 575,100 500,200",
    xValues: [ 200, 249.48426818847656, 309.1169738769531, 371.97515869140625, 435.7851257324219, 496.41815185546875, 500.0001220703125 ],
    yValues: [ 200, 160.3770294189453, 137.765380859375, 126.64154052734375, 126.40363311767578, 144.5059051513672, 199.99981689453125 ]
  },{
    path: "M100,200 C100,100 250,100 250,200 S400,300 400,200",
    xValues: [ 100, 136.8885955810547, 213.11134338378906, 250, 286.88836669921875, 363.11114501953125, 400 ],
    yValues: [ 200, 134.37181091308594, 134.3717498779297, 199.99984741210938, 265.6280517578125, 265.62835693359375, 200 ]
  },{
    path: "M100,200 S400,300 400,200",
    xValues: [ 100, 152.38723754882812, 205.42906188964844, 259.1198425292969, 313.48455810546875, 367.6199951171875, 400 ],
    yValues: [ 200, 215.58023071289062, 228.76190185546875, 238.95660400390625, 244.3085174560547, 238.78338623046875, 200 ]
  },{
    path: "M240,100C290,100,240,225,290,200S290,75,340,50S515,100,390,150S215,200,90,150S90,25,140,50S140,175,190,200S190,100,240,100",
    xValues: [ 240, 315.0015563964844, 441.4165954589844, 240.0000762939453, 38.58317947387695, 164.99853515625, 240 ],
    yValues: [ 100, 121.3836898803711, 111.11810302734375, 187.49990844726562, 111.11775207519531, 121.38365936279297, 100 ]
  },{
    path: "m240,100c50,0,0,125,50,100s0,-125,50,-150s175,50,50,100s-175,50,-300,0s0,-125,50,-100s0,125,50,150s0,-100,50,-100",
    xValues: [ 240, 315.0015563964844, 441.4165954589844, 240.0000762939453, 38.58317947387695, 164.99853515625, 240 ],
    yValues: [ 100, 121.3836898803711, 111.11810302734375, 187.49990844726562, 111.11775207519531, 121.38365936279297, 100 ]
  }];

  for(var i=0; i< paths.length; i++){
    for(var j=0; j<paths[i].xValues.length; j++){
      properties = path.svgPathProperties(paths[i].path);
      var position = properties.getPointAtLength(j*properties.getTotalLength()/(paths[i].xValues.length-1));
      test.inDelta(position.x, paths[i].xValues[j], 1);
      test.inDelta(position.y, paths[i].yValues[j], 1);
    }
    test.deepEqual(properties.getPointAtLength(10000000), properties.getPointAtLength(properties.getTotalLength()));
    test.deepEqual(properties.getPointAtLength(-1), properties.getPointAtLength(0));
  }
  test.end();
});
