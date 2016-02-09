var test = require('tape');
var tapSpec = require('tap-spec');
var tapDiff = require('tap-diff');
var tapNotify = require('tap-notify');
var postcss = require("postcss");
var plugin = require("..");


// if(require.main === module) {
if(!module.parent) {
  test.createStream()
    // .pipe(tapSpec())
    // .pipe(tapNotify())
    .pipe(tapDiff())
    .pipe(process.stdout);
}

var opts = {};
var processor = postcss([plugin(opts)]);

var tests = {
  "inline": [ 
    {
      "msg": "Set aspect-ratio with a simple '4:3' special ratio value (converted to a %).",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: '4:3'; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 75%; box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set aspect-ratio with a more complex calc value with a special ratio value of '16:9'.",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: calc('16:9' - 1em); }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: calc(56.25% - 1em); box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set aspect-ratio with a simple percentage value (100%, square ratio).",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: 100%; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 100%; box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set aspect with a simple '4:3' special ratio value (converted to a %).",
      "chk": "equal",
      "in": ".test { position: relative; aspect: '4:3'; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 75%; box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set aspect with a more complex calc value with a special ratio value of '16:9'.",
      "chk": "equal",
      "in": ".test { position: relative; aspect: calc('16:9' - 1em); }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: calc(56.25% - 1em); box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set aspect with a simple percentage value (100%, square ratio).",
      "chk": "equal",
      "in": ".test { position: relative; aspect: 100%; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 100%; box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set ratio with a simple '4:3' special ratio value (converted to a %).",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: '4:3'; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 75%; box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set ratio with a more complex calc value with a special ratio value of '16:9'.",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: calc('16:9' - 1em); }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: calc(56.25% - 1em); box-sizing: border-box;\n",
        "}")
    },
    {
      "msg": "Set ratio with a simple percentage value (100%, square ratio).",
      "chk": "equal",
      "in": ".test { position: relative; aspect-ratio: 100%; }",
      "out": "".concat(".test { position: relative; box-sizing: border-box; }\n",
        ".test > * {\n",
        "position: absolute; top: 0; right: 0; bottom: 0; left: 0; box-sizing: border-box;\n",
        "}\n",
        ".test:before {\n",
        "position: relative; display: block; content: \"\"; padding-top: 100%; box-sizing: border-box;\n",
        "}")
    }
  ]
}

test('Test the custom property aspect-ratio(aka aspect, aka ratio).', function(t) {
  t.plan(tests['inline'].length);
  var lazy = null;
  var css = null;
  var fix = null;

  for (var i = 0; i < tests['inline'].length; i++) {
    fix = tests['inline'][i];
    lazy = processor.process(fix.in);
    
    if(fix.chk == 'throws')
      t.throws(function() { css = lazy.css; }, fix.out);
    else
      t[fix.chk](ws(lazy.css), ws(fix.out));
  };
});

// Normalize whitespace.
function ws(text) {
  return text.replace(/\s+/g, ' ');
}
