[travis]:       https://travis-ci.org/arccoza/postcss-aspect-ratio
[travis-img]:   https://img.shields.io/travis/arccoza/postcss-aspect-ratio.svg
# PostCSS Aspect Ratio [![Travis Build Status][travis-img]][travis]

A PostCSS plugin to fix an element's dimensions to an aspect ratio.

## Explanation
The plugin provides three new properties and one new value type:
  * The `aspect-ratio` property makes the height of this element relative to its width, `height` will be dynamic based on the ratio. `aspect-ratio` has two aliases you can use instead:
    * `ratio`
    * `aspect`
  * An `aspect-ratio` property that includes a value expressed as `'NUM:NUM'` (eg. `'4:3'`) will automatically be converted to a percentage (3/4 * 100 = 75%). You must wrap the value in single ' or double " quotes.

The effect is achieved using the quirky behaviour of CSS percentage padding; any element with a percentage value for its padding property will use the width of its container to calculate that percentage.
Therefore this plugin requires a specific HTML structure to work. The element you wish to constrain with an aspect ratio and a single inner element that will hold its contents.

```html
<div class="aspect-box">
  <div class="aspect-box__content">
    <!-- Any content you like, very useful for video and image elements. -->
  </div>
</div>
```

## Example 1
A simple example using the custom ratio value `'16:9'`.

```css
/* Input. */
.aspect-box {
  position: relative;
  background: lime;
  aspect-ratio: '16:9';
}

/* Output. */
.aspect-box {
  position: relative;
  background: lime;
  box-sizing: border-box;
}

.aspect-box > * /* This targets .aspect-box__content */ {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0; 
  left: 0; 
  box-sizing: border-box;
}

.aspect-box:before /* This pseudo element uses the padding trick to set the height. */ {
  position: relative;
  display: block;
  content: "";
  padding-top: 56.25%;
  box-sizing: border-box;
}
```

## Example 2
A more complex example using the ratio value `calc('4:3' - 20px)`.

```css
/* Input. */
.aspect-box {
  position: relative;
  background: lime;
  aspect-ratio: calc('4:3' - 20px);
}

/* Output. */
.aspect-box {
  position: relative;
  background: lime;
  box-sizing: border-box;
}

.aspect-box > * {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0; 
  left: 0; 
  box-sizing: border-box;
}

.aspect-box:before {
  position: relative;
  display: block;
  content: "";
  padding-top: calc(75% - 20px);
  box-sizing: border-box;
}
```
