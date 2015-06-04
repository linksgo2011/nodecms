# grunt-cssjanus

Grunt plugin to convert CSS stylesheets between left-to-right and right-to-left

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-cssjanus --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks( 'grunt-cssjanus' );
```

### Options

#### options.swapLtrRtlInUrl
Type: `Boolean`
Default value: `true`

Whether to replace 'ltr' with 'rtl' and vice versa in urls.

#### options.swapLeftRightInUrl
Type: `Boolean`
Default value: `false`

Whether to replace 'left' with 'right' and vice versa in urls.

#### options.generateExactDuplicates
Type: `Boolean`
Default value: `false`

Whether to generate the RTL file if it ends up being the same as the LTR file.

#### options.processContent
Type: `Callback`
Default value: `false`

If set, the function will be called on the CSS after CSSJanus has run.


## Release History

0.2.3 - Update minimum cssjanus version to 1.1.2

0.2.3 - Update minimum cssjanus version

0.2.2 - Revert to using the standard cssjanus 1.0.2 module

0.2.1 - Fix an undefined variable in the processContent callback.
		Temporarily depend on patched cssjanus module while waiting for bugs to be fixed upstream. See:
			https://github.com/nacin/cssjanus/commit/e2e761911c8f4d7755e002996f2788cfb603b74c
			https://github.com/nacin/cssjanus/commit/964f83fe1b58148828186d73e300bc41e2ceadeb


0.2.0 - Add the processContent callback to the be called on CSS after CSSJanus has run

0.1.2 - Only outputs file creation message if file has been created

0.1.1 - Add the generateExactDuplicates option

0.1.0 - initial release
