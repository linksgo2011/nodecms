# Release History

## v1.1.2 / 2015-02-03

* Support !importand and slash in border-radius values (Dominik Schilling)

## v1.1.1 / 2014-11-19

* Support !important in four-value declarations (Matthew Flaschen)

## v1.1.0 / 2014-09-23

* Move repository to github.com/cssjanus (Timo Tijhof)
* Drop support for node.js v0.8 (Timo Tijhof)
* Correct documentation of calculateNewBorderRadius (Ed Sanders)
* test: Convert test cases to JSON (Timo Tijhof)
* Do not flip unknown properties starting with "left" or "right" (Timo Tijhof)
* Do not flip five or more consecutive values (Timo Tijhof)
* Support CSS3 rgb(a) and hsl(a) color notation (Timo Tijhof)
* Flip text-shadow and box-shadow (Timo Tijhof)
* Account for attribute selectors in open brace lookahead (Timo Tijhof)
* Account for minified values in border-radius (Roan Kattouw)
* Flip border-style (Timo Tijhof)
* Account for decimals and lack of vertical value in background-position (Roan Kattouw)

## v1.0.2 / 2014-01-28

* Prevent issues with css selectors containing parentheses (Yoav Farhi)
* Fix bgHorizontalPercentageRegExp to not be too greedy (Dion Hulse)
* Support "/*!" syntax for @noflip (Tom Yam)

## v1.0.1 / 2013-08-08

* Fix global variable leak (Trevor Parscal)

## v1.0.0 / 2012-06-28

* Initial commit (Trevor Parscal)
