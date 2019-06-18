//Calculate ans Arc curve length and positionAtLength
//The point in ellipse functions have been taken from https://github.com/MadLittleMods/svg-curve-lib/tree/f07d6008a673816f4cb74a3269164b430c3a95cb

export default function(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y) {
  return new Arc(x0, y0, rx,ry, xAxisRotate, LargeArcFlag,SweepFlag, x,y);
}

function Arc(x0, y0,rx,ry, xAxisRotate, LargeArcFlag, SweepFlag,x1,y1) {
  this.x0 = x0;
  this.y0 = y0;
  this.rx = rx;
  this.ry = ry;
  this.xAxisRotate = xAxisRotate;
  this.LargeArcFlag = LargeArcFlag;
  this.SweepFlag = SweepFlag;
  this.x1 = x1;
  this.y1 = y1;

  var lengthProperties = approximateArcLengthOfCurve(300, function(t) {
    return pointOnEllipticalArc({x: x0, y:y0}, rx, ry, xAxisRotate,
                                 LargeArcFlag, SweepFlag, {x: x1, y:y1}, t);
  });

  this.length = lengthProperties.arcLength;
}

Arc.prototype = {
  constructor: Arc,
  init: function() {

    
  },

  getTotalLength: function() {
    return this.length;
  },
  getPointAtLength: function(fractionLength) {
    
    if(fractionLength < 0){
      fractionLength = 0;
    } else if(fractionLength > this.length){
      fractionLength = this.length;
    }
    
    var position = pointOnEllipticalArc({x: this.x0, y:this.y0}, 
      this.rx, this.ry, this.xAxisRotate,
      this.LargeArcFlag, this.SweepFlag,
      {x: this.x1, y: this.y1},
      fractionLength/this.length);
     
    return {x: position.x, y: position.y};

  },
  getTangentAtLength: function(fractionLength) {
    if(fractionLength < 0){
        fractionLength = 0;
        } else if(fractionLength > this.length){
        fractionLength = this.length;
        }
        var position = pointOnEllipticalArc({x: this.x0, y:this.y0}, 
          this.rx, this.ry, this.xAxisRotate,
          this.LargeArcFlag, this.SweepFlag,
          {x: this.x1, y: this.y1},
          fractionLength/this.length); 
        return {x: Math.cos(position.ellipticalArcAngle - Math.PI/2), y: Math.sin(position.ellipticalArcAngle - Math.PI/2)};
        
  },
  getPropertiesAtLength: function(fractionLength){
    var tangent = this.getTangentAtLength(fractionLength);
    var point = this.getPointAtLength(fractionLength);
    return {x: point.x, y: point.y, tangentX: tangent.x, tangentY: tangent.y};
  }
};

function pointOnEllipticalArc(p0, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, p1, t) {

  // In accordance to: http://www.w3.org/TR/SVG/implnote.html#ArcOutOfRangeParameters
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  xAxisRotation = mod(xAxisRotation, 360);
  var xAxisRotationRadians = toRadians(xAxisRotation);
  // If the endpoints are identical, then this is equivalent to omitting the elliptical arc segment entirely.
  if(p0.x === p1.x && p0.y === p1.y) {
    return p0;
  }
  
  // If rx = 0 or ry = 0 then this arc is treated as a straight line segment joining the endpoints.    
  if(rx === 0 || ry === 0) {
    return this.pointOnLine(p0, p1, t);
  }

  
  // Following "Conversion from endpoint to center parameterization"
  // http://www.w3.org/TR/SVG/implnote.html#ArcConversionEndpointToCenter
  
  // Step #1: Compute transformedPoint
  var dx = (p0.x-p1.x)/2;
  var dy = (p0.y-p1.y)/2;
  var transformedPoint = {
    x: Math.cos(xAxisRotationRadians)*dx + Math.sin(xAxisRotationRadians)*dy,
    y: -Math.sin(xAxisRotationRadians)*dx + Math.cos(xAxisRotationRadians)*dy
  };
  // Ensure radii are large enough
  var radiiCheck = Math.pow(transformedPoint.x, 2)/Math.pow(rx, 2) + Math.pow(transformedPoint.y, 2)/Math.pow(ry, 2);
  if(radiiCheck > 1) {
    rx = Math.sqrt(radiiCheck)*rx;
    ry = Math.sqrt(radiiCheck)*ry;
  }

  // Step #2: Compute transformedCenter
  var cSquareNumerator = Math.pow(rx, 2)*Math.pow(ry, 2) - Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) - Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
  var cSquareRootDenom = Math.pow(rx, 2)*Math.pow(transformedPoint.y, 2) + Math.pow(ry, 2)*Math.pow(transformedPoint.x, 2);
  var cRadicand = cSquareNumerator/cSquareRootDenom;
  // Make sure this never drops below zero because of precision
  cRadicand = cRadicand < 0 ? 0 : cRadicand;
  var cCoef = (largeArcFlag !== sweepFlag ? 1 : -1) * Math.sqrt(cRadicand);
  var transformedCenter = {
    x: cCoef*((rx*transformedPoint.y)/ry),
    y: cCoef*(-(ry*transformedPoint.x)/rx)
  };

  // Step #3: Compute center
  var center = {
    x: Math.cos(xAxisRotationRadians)*transformedCenter.x - Math.sin(xAxisRotationRadians)*transformedCenter.y + ((p0.x+p1.x)/2),
    y: Math.sin(xAxisRotationRadians)*transformedCenter.x + Math.cos(xAxisRotationRadians)*transformedCenter.y + ((p0.y+p1.y)/2)
  };

  
  // Step #4: Compute start/sweep angles
  // Start angle of the elliptical arc prior to the stretch and rotate operations.
  // Difference between the start and end angles
  var startVector = {
    x: (transformedPoint.x-transformedCenter.x)/rx,
    y: (transformedPoint.y-transformedCenter.y)/ry
  };
  var startAngle = angleBetween({
    x: 1,
    y: 0
  }, startVector);
  
  var endVector = {
    x: (-transformedPoint.x-transformedCenter.x)/rx,
    y: (-transformedPoint.y-transformedCenter.y)/ry
  };
  var sweepAngle = angleBetween(startVector, endVector);
  
  if(!sweepFlag && sweepAngle > 0) {
    sweepAngle -= 2*Math.PI;
  }
  else if(sweepFlag && sweepAngle < 0) {
    sweepAngle += 2*Math.PI;
  }
  // We use % instead of `mod(..)` because we want it to be -360deg to 360deg(but actually in radians)
  sweepAngle %= 2*Math.PI;
  
  // From http://www.w3.org/TR/SVG/implnote.html#ArcParameterizationAlternatives
  var angle = startAngle+(sweepAngle*t);
  var ellipseComponentX = rx*Math.cos(angle);
  var ellipseComponentY = ry*Math.sin(angle);
  
  var point = {
    x: Math.cos(xAxisRotationRadians)*ellipseComponentX - Math.sin(xAxisRotationRadians)*ellipseComponentY + center.x,
    y: Math.sin(xAxisRotationRadians)*ellipseComponentX + Math.cos(xAxisRotationRadians)*ellipseComponentY + center.y
  };

  // Attach some extra info to use
  point.ellipticalArcStartAngle = startAngle;
  point.ellipticalArcEndAngle = startAngle+sweepAngle;
  point.ellipticalArcAngle = angle;

  point.ellipticalArcCenter = center;
  point.resultantRx = rx;
  point.resultantRy = ry;

  

  return point;
}

function approximateArcLengthOfCurve(resolution, pointOnCurveFunc) {
  // Resolution is the number of segments we use
  resolution = resolution ? resolution : 500;
  
  var resultantArcLength = 0;
  var arcLengthMap = [];
  var approximationLines = [];

  var prevPoint = pointOnCurveFunc(0);
  var nextPoint;
  for(var i = 0; i < resolution; i++) {
    var t = clamp(i*(1/resolution), 0, 1);
    nextPoint = pointOnCurveFunc(t);
    resultantArcLength += distance(prevPoint, nextPoint);
    approximationLines.push([prevPoint, nextPoint]);

    arcLengthMap.push({
      t: t,
      arcLength: resultantArcLength
    });
    
    prevPoint = nextPoint;
  }
  // Last stretch to the endpoint
  nextPoint = pointOnCurveFunc(1);
  approximationLines.push([prevPoint, nextPoint]);
  resultantArcLength += distance(prevPoint, nextPoint);
  arcLengthMap.push({
    t: 1,
    arcLength: resultantArcLength
  });

  return {
    arcLength: resultantArcLength,
    arcLengthMap: arcLengthMap,
    approximationLines: approximationLines
  };
}

function mod(x, m) {
  return (x%m + m)%m;
}

function toRadians(angle) {
  return angle * (Math.PI / 180);
}

function distance(p0, p1) {
  return Math.sqrt(Math.pow(p1.x-p0.x, 2) + Math.pow(p1.y-p0.y, 2));
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}


function angleBetween(v0, v1) {
  var p = v0.x*v1.x + v0.y*v1.y;
  var n = Math.sqrt((Math.pow(v0.x, 2)+Math.pow(v0.y, 2)) * (Math.pow(v1.x, 2)+Math.pow(v1.y, 2)));
  var sign = v0.x*v1.y - v0.y*v1.x < 0 ? -1 : 1;
  var angle = sign*Math.acos(p/n);
  
  //var angle = Math.atan2(v0.y, v0.x) - Math.atan2(v1.y,  v1.x);
  
  return angle;
}