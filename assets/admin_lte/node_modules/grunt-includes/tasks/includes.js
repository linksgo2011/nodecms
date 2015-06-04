/**
 * grunt-includes
 * https://github.com/vanetix/grunt-includes
 *
 * Copyright (c) 2013 Matt McFarland
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  /**
   * Dependencies
   */

  var path = require('path');

  // Regex for matching new lines
  var newlineRegexp = /\r?\n/g;

  // Regex for parsing includes
  var defaultRegexp = /^(\s*)include\s+"(\S+)"\s*$/;

  // Regexp to replace with the file inside a template
  var defaultTemplateFileRegexp = /\{\{\s?file\s?\}\}/;

  // Regexp for inerpolating the filename in the template
  var templateFilenameRegexp = /\{\{\s?fileName\s?\}\}/;

  /**
   * Core `grunt-includes` task
   * Iterates over all source files and calls `recurse(path)` on each
   */

  grunt.registerMultiTask('includes', 'Include other files within files.', function() {
    var banner;

    // Default options
    var opts = this.options({
      debug: false,
      banner: '',
      silent: false,
      duplicates: true,
      includeRegexp: defaultRegexp,
      includePath: '',
      filenamePrefix: '',
      filenameSuffix: '',
      template: '',
      templateFileRegexp: defaultTemplateFileRegexp
    });

    if(grunt.util.kindOf(opts.includeRegexp) === 'string') {
      opts.includeRegexp = new RegExp(opts.includeRegexp);
    }

    if(grunt.util.kindOf(opts.templateFileRegexp) === 'string') {
      opts.templateFileRegexp = new RegExp(opts.templateFileRegexp);
    }

    // Render banner
    banner = grunt.template.process(opts.banner);

    this.files.forEach(function(f) {
      var src, cwd = f.cwd;

      src = f.src.filter(function(p) {
        if(cwd) {
          p = path.join(f.cwd, p);
        }

        if(grunt.file.isFile(p)) {
          return true;
        } else {
          grunt.fail.fatal('Source "' + p + '" is not a file');
          return false;
        }
      });

      if(src.length > 1 && isFilename(f.dest)) {
        grunt.fail.fatal('Source file cannot be more than one when dest is a file.');
      }

      src.forEach(function(p) {
        var fileName = f.flatten ? path.basename(p) : p;
        var outFile = isFilename(f.dest) ? f.dest : path.join(f.dest, fileName);

        if(cwd) {
          p = path.join(cwd, p);
        }

        grunt.file.write(outFile, banner + recurse(p, opts));

        if(!opts.silent) {
          grunt.log.oklns('Saved ' + outFile);
        }
      });

    });
  });

  /**
   * Checks if `p` is a filepath, being it has an extension.
   *
   * @param {String} p
   * @return {Boolean}
   */

  function isFilename(p) {
    return !!path.extname(p);
  }

  /**
   * Returns the comment style for file `p`
   *
   * @param {String} p
   * @return {String}
   */

  function commentStyle(p) {
    var comments,
        ext = path.extname(p).slice(1);

    comments = {
      js: "/* %s */",
      css: "/* %s */",
      html: "<!-- %s -->"
    };

    return comments[ext] || '/* %s */';
  }

  /**
   * Returns the new line style for file `p`
   *
   * @param {String} p
   * @return {String}
   */

  function newlineStyle(p) {
    var matches = grunt.file.read(p).match(newlineRegexp);

    return (matches && matches[0]) || grunt.util.linefeed;
  }

  /**
   * Helper for `includes` builds all includes for `p`
   *
   * @param {String} p
   * @return {String}
   */

  function recurse(p, opts, included, indents) {
    var src, next, match, error, comment, content,
        newline, compiled, indent, fileLocation,
        currentTemplate;

    if(!grunt.file.isFile(p)) {
      grunt.fail.warn('Included file "' + p + '" not found.');
      return 'Error including "' + p + '".';
    }

    indents = indents || '';
    comment = commentStyle(p);
    newline = newlineStyle(p);
    included = included || [];

    // If `opts.duplicates` is false and file has been included, error
    if(!opts.duplicates && ~included.indexOf(p)) {
      error = 'Duplicate include: ' + p + ' skipping.';
      grunt.log.error(error);

      if(opts.debug) {
        return comment.replace(/%s/g, error);
      } else {
        return '';
      }
    }

    // At this point the file is considered included
    included.push(p);

    // Split the file on newlines
    src = grunt.file.read(p).split(newline);

    // Loop through the file calling `recurse` if an include is found
    compiled = src.map(function(line) {
      match = line.match(opts.includeRegexp);

      // If the line has an include statement, recurse
      if(match) {
        indent = match[1];
        fileLocation = match[2];

        if (!fileLocation) {
          fileLocation = indent;
          indent = '';
        }

        fileLocation = opts.filenamePrefix + fileLocation + opts.filenameSuffix;
        next = path.join((opts.includePath || path.dirname(p)), fileLocation);
        content = recurse(next, opts, included, indents + indent);

        // Wrap file around in template if `opts.template` has '{{file}}' in it.
        if(opts.template !== '' && opts.template.match(opts.templateFileRegexp)) {
          currentTemplate = opts.template.split(newline).map(function(line) {
            line = line.replace(templateFilenameRegexp, fileLocation);

            if (line.match(opts.templateFileRegexp)) {
              return line;
            } else {
              return indent + indents + line;
            }
          });

          // Safe guard against $ replacements - this can probably be improved
          content = content.replace(/\$/g, '$$$$');
          content = currentTemplate.join(newline).replace(opts.templateFileRegexp, content);
        }

        // Safe guard against $ replacements, change $ to $$
        content = content.replace(/\$/g, '$$$$');
        line = line.replace(opts.includeRegexp, content);

        // Include debug comments if `opts.debug`
        if(opts.debug) {
          line = comment.replace(/%s/g, 'Begin: ' + next) +
                 newline + line + comment.replace(/%s/g, 'End: ' + next);
        }
      }

      // If there are indents and not a match, add them to the line
      return line && indents && !match ? indents + line : line;
    });

    return  compiled.join(newline);
  }
};
