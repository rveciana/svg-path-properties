(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('parse-svg-path'), require('bezier-js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'parse-svg-path', 'bezier-js'], factory) :
  (factory((global.d3 = global.d3 || {}),global.parse,global.Bezier));
}(this, function (exports,parse,Bezier) { 'use strict';

  parse = 'default' in parse ? parse['default'] : parse;
  Bezier = 'default' in Bezier ? Bezier['default'] : Bezier;

  function pathProperties(svgString) {
    var length = 0;

    function svgProperties(string){
      var parsed = parse(string);
      var cur = [0, 0];
      var prev_point = [0, 0];
      var curve;
      for (var i = 0; i < parsed.length; i++){
        //moveTo
        if(parsed[i][0] === "M"){
          cur = [parsed[i][1], parsed[i][2]];
        } else if(parsed[i][0] === "m"){
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        }
        //lineTo
        else if(parsed[i][0] === "L"){
          length = length + Math.sqrt(Math.pow(cur[0] - parsed[i][1], 2) + Math.pow(cur[1] - parsed[i][2], 2));
          cur = [parsed[i][1], parsed[i][2]];
        } else if(parsed[i][0] === "l"){
          length = length + Math.sqrt(Math.pow(parsed[i][1], 2) + Math.pow(parsed[i][2], 2));
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[1]];
        } else if(parsed[i][0] === "H"){
          length = length + Math.abs(cur[0] - parsed[i][1]);
          cur[0] = parsed[i][1];
        } else if(parsed[i][0] === "h"){
          length = length + Math.abs(parsed[i][1]);
          cur[0] = parsed[i][1] + cur[0];
        } else if(parsed[i][0] === "V"){
          length = length + Math.abs(cur[1] - parsed[i][1]);
          cur[1] = parsed[i][1];
        } else if(parsed[i][0] === "v"){
          length = length + Math.abs(parsed[i][1]);
          cur[1] = parsed[i][1] + cur[1];
        //Close path
        }  else if(parsed[i][0] === "z" || parsed[i][0] === "Z"){
          length = length + Math.sqrt(Math.pow(parsed[0][1] - cur[0], 2) + Math.pow(parsed[0][1] - cur[1], 2));
          cur = [parsed[0][1], parsed[0][2]];
        }
        //Cubic Bezier curves
        else if(parsed[i][0] === "C"){
          curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4] , parsed[i][5], parsed[i][6]);
          length = length + curve.length();
          cur = [parsed[i][5], parsed[i][6]];
        } else if(parsed[i][0] === "c"){
          curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4] , cur[0] + parsed[i][5], cur[1] + parsed[i][6]);
          length = length + curve.length();
          cur = [parsed[i][5] + cur[0], parsed[i][6] + cur[1]];
        } else if(parsed[i][0] === "S"){
          if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1] - parsed[i][3], cur[1] + parsed[i][2] - parsed[i][4], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          }
          length = length + curve.length();
          cur = [parsed[i][3], parsed[i][4]];
        }  else if(parsed[i][0] === "s"){
          if(i>0 && ["C","c","S","s"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1] - parsed[i][3], cur[1] + parsed[i][2] - parsed[i][4], cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1], cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          }
          length = length + curve.length();
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
        }
        //Quadratic Bezier curves
        else if(parsed[i][0] === "Q"){
          curve = new Bezier(cur[0], cur[1] , parsed[i][1], parsed[i][2] , parsed[i][3], parsed[i][4]);
          length = length + curve.length();
          cur = [parsed[i][3], parsed[i][4]];
          prev_point = [parsed[i][1], parsed[i][2]];
        }  else if(parsed[i][0] === "q"){
          curve = new Bezier(cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2] , cur[0] + parsed[i][3], cur[1] + parsed[i][4]);
          length = length + curve.length();
          prev_point = [cur[0] + parsed[i][1], cur[1] + parsed[i][2]];
          cur = [parsed[i][3] + cur[0], parsed[i][4] + cur[1]];
        } else if(parsed[i][0] === "T"){
          if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , parsed[i][1], parsed[i][2]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1] , parsed[i][1], parsed[i][2]);
          }
          length = length + curve.length();
          prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1], parsed[i][2]];
        } else if(parsed[i][0] === "t"){
          if(i>0 && ["Q","q","T","t"].indexOf(parsed[i-1][0]) > -1){
            curve = new Bezier(cur[0], cur[1] , 2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
          } else {
            curve = new Bezier(cur[0], cur[1] , cur[0], cur[1] , cur[0] + parsed[i][1], cur[1] + parsed[i][2]);
          }
          length = length + curve.length();
          prev_point = [2 * cur[0] - prev_point[0] , 2 * cur[1] - prev_point[1]];
          cur = [parsed[i][1] + cur[0], parsed[i][2] + cur[0]];
        }

      }
      return svgProperties;
    }

    svgProperties.getLength = function(){
      return length;
    };

    return svgProperties(svgString);
  }

  exports.pathProperties = pathProperties;

  Object.defineProperty(exports, '__esModule', { value: true });

}));