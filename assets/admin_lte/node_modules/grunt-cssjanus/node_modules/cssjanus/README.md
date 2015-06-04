[![Build Status](https://travis-ci.org/cssjanus/cssjanus.svg?branch=master)](https://travis-ci.org/cssjanus/cssjanus) [![npm](https://img.shields.io/npm/v/cssjanus.svg?style=flat)](https://www.npmjs.com/package/cssjanus)

# CSSJanus

Converts CSS stylesheets between left-to-right and right-to-left.

Based the original [CSSJanus](https://code.google.com/p/cssjanus/) Google project.

## Install
```sh
npm install cssjanus
```

## Basic usage
```javascript
var cssjanus = require( 'cssjanus' );
var rtlCss = cssjanus.transform( ltrCss );
```

## Advanced usage

```
transform( css, swapLtrRtlInUrl, swapLeftRightInUrl )
```

* `css` (String) Stylesheet to transform
* `swapLtrRtlInUrl` (Boolean) Swap 'ltr' and 'rtl' in URLs
* `swapLeftRightInUrl` (Boolean) Swap 'left' and 'right' in URLs

### Preventing flipping
Use a `/* @noflip */` comment to protect a rule from being changed.

```css
.rule1 {
  /* Will be converted to margin-right */
  margin-left: 1em;
}
/* @noflip */
.rule2 {
  /* Will be preserved as margin-left */
  margin-left: 1em;
}
```

## See also
* [Interactive demo](https://cssjanus.github.io)
