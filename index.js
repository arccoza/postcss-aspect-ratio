var postcss = require('postcss');


// Default properties for all layouts.
var defaults = {};
defaults.container = {
  "box-sizing": "border-box",
  "margin-left": "0",
  "margin-right": "0",
  "text-align": "initial",
  "font-size": "initial"
}

defaults.item = {
  "box-sizing": "border-box",
  "display": "initial",
  "text-align": "initial",
  "vertical-align": "initial",
  "white-space": "initial",
  "font-size": "initial"
}

defaults.pseudo = {
  "position": "relative",
  "display": "none",
  "content": "normal",
  "clear": "none"
}

module.exports = postcss.plugin('postcss-layout', function (opts) {
  opts = opts || {};
  opts._grids = {};
  var grids = opts._grids;
  
  return function (css, result) {
    css
      .walkDecls(/aspect-ratio|aspect|ratio/, function(decl) {
        console.log(decl);
      });
  };
});


// Convert a js obj to a postcss rule, extending clonedRule if it is passed in.
function objToRule(obj, clonedRule) {
  var rule = clonedRule || postcss.rule();
  var skipKeys = ['selector', 'selectors', 'source'];

  if(obj.selector)
    rule.selector = obj.selector;
  else if(obj.selectors)
    rule.selectors = obj.selectors;

  if(obj.source)
    rule.source = obj.source;

  for(var k in obj) {
    if(obj.hasOwnProperty(k) && !(skipKeys.indexOf(k) + 1)) {
      var v = obj[k];
      var found = false;

      // If clonedRule was passed in, check for an existing property.
      if(clonedRule) {
        rule.each(function(decl) {
          if(decl.prop == k) {
            decl.value = v;
            found = true;
            return false;
          }
        });
      }
      
      // If no clonedRule or there was no existing prop.
      if(!clonedRule || !found)
        rule.append({prop: k, value: v});
    }
  }

  return rule;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}