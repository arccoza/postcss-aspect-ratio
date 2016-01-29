var postcss = require('postcss');


// Default properties for aspect ratios.
var defaults = {};
defaults.container = {
  "position": "relative",
  "box-sizing": "border-box"
}

defaults.item = {
  "position": "absolute",
  "top": "0",
  "right": "0",
  "bottom": "0",
  "left": "0",
  "box-sizing": "border-box"
}

defaults.pseudo = {
  "position": "relative",
  "display": "block",
  "content": "\"\"",
  "padding-top": "100%",
  "box-sizing": "border-box"
}

module.exports = postcss.plugin('postcss-layout', function (opts) {
  opts = opts || {};
  opts._grids = {};
  var grids = opts._grids;
  
  return function (css, result) {
    css
      .walkDecls(/^(aspect-ratio|aspect|ratio)$/, function(decl) {
        var ratio = {};
        ratio.value = processRatioValue(css, decl.parent, decl);
        processRatioConf(css, decl.parent, decl, ratio);

        aspectRatio(css, decl.parent, decl, ratio);
      });
  };
});

function processRatioValue(css, rule, decl) {
  var ratio = null;
  var re = /['"]?((\d+)(?:\:|\|)(\d+))['"]?/g;

  // ratio = decl.value.match(/\s*((\d+)(?:\:|\|)(\d+))\s*/);
  // if(ratio) {
  //   ratio = ratio[3] / ratio[2] * 100 + '%';
  //   console.log(ratio);
  // }
  // else if(ratio = decl.value.match(/\s*(\d+(?:\.\d+)%)\s*/)) {
  //   ratio = ratio[0];
  // }
  // else {
  //   throw decl.error('Invalid aspect-ratio value. ' + decl.prop + ': ' + decl.value, { plugin: 'postcss-aspect-ratio' });
  // }

  ratio = decl.value;
  ratio = ratio.replace(re, function(match, r, x, y) {
    return y / x * 100 + '%';
  });

  return ratio;
}

function processRatioConf(css, rule, decl, ratio) {
  var sels = [];

  ratio.container = clone(defaults.container);
  // ratio.container.source = decl.source;
  ratio.item = clone(defaults.item);
  ratio.item.source = decl.source;
  ratio.pseudo = clone(defaults.pseudo);
  ratio.pseudo.source = decl.source;

  for (var i = 0; i < rule.selectors.length; i++) {
    sels.push(rule.selectors[i] + ' > *');
  };

  ratio.item.selector = sels.join(', ');
  sels = [];

  for (var i = 0; i < rule.selectors.length; i++) {
    sels.push(rule.selectors[i] + ':before');
  };

  ratio.pseudo.selector = sels.join(', ');

}

function aspectRatio(css, rule, decl, ratio) {
  var parent = rule.parent;

  objToRule(ratio.container, rule);
  ratio.pseudo["padding-top"] = ratio.value;
  parent.insertAfter(rule, objToRule(ratio.pseudo));
  parent.insertAfter(rule, objToRule(ratio.item));

  // Remove the aspect-ratio prop.
  decl.remove();
}

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