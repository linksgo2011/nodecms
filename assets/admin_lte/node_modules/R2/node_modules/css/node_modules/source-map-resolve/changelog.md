### Version 0.1.4 (2014-06-16) ###

- Fixed: `sourcesContent` was mis-typed as `sourceContents`, which meant that
  the `sourcesContent` property of source maps never was used when resolving
  sources.


### Version 0.1.3 (2014-05-06) ###

- Only documentation and meta-data changes.


### Version 0.1.2 (2014-03-23) ###

- Improved: Source maps starting with `)]}'` are now parsed correctly. The spec
  allows source maps to start with that character sequence to prevent XSSI
  attacks.


### Version 0.1.1 (2014-03-06) ###

- Improved: Make sourceRoot resolving more sensible.

  A source root such as `/scripts/subdir` is now treated as `/scripts/subdir/`
  — that is, as a directory called “subdir”, not a file called “subdir”.
  Pointing to a file as source root does not makes sense.



### Version 0.1.0 (2014-03-03) ###

- Initial release.
