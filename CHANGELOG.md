# Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

# v4.0.2 2018-06-25

* Breaking changes:
  * Update to be React 16 compatible
  * Replace attache uploader with direct to S3 version
  * Removes CSS Modules in favour of [Emotion](https://github.com/emotion-js/emotion/blob/master/docs/css.md)
* Remove `react-portal`, adds first-party implementation instead
* Adds better data-attr hooks for testing
* Add button to copy URL for uploads
* Add ability to set an "Option control" for search selection fields. This will be rendered before any options in the search box.
* Fix issues in rich text fields:
  * Ensure configuration is passed down to child formalist instances
  * Make sure events bubble out of child formalist instances to the parent instance (for blocking uploads etc)
* Fix bug where date/time fields would not be cleared properly

# v3.0.4 2018-03-20

* Fix issue with removing atomic blocks using button

# v3.0.3 2018-02-21

* Atomic blocks remove themselves when invalid. I.e., they have no entity or their entity is not of type "formalist".

# v3.0.2 2018-02-14

* Automatically break excessively long words in the rich text editor.

# v3.0.1 2017-08-02

* Fix issue with breaking draft-js API signatures.

# v3.0.0 2017-08-02

* Add horizontal rule/divider as block type.
* Bump draft-js dependencies.

# v2.0.0 2017-03-12

* Update to [formalist-compose](http://github.com/icelab/formalist-compose) 2.x.
* Use the internal event bus in formalist-compose 2.x to busy/idle states from the multi-upload field.

# v1.0.1 2017-02-23

* Fixed ignore case when matching filenames for image-type uploads.

# v1.0.0 2017-02-23

* Releasing as v1.0.0 for better semver compatibility.

# v0.0.6 2017-02-23

* Use file preview blobs for rendering thumbnails on all new uploads.

# v0.0.5 2017-02-15

* Fix error in import reference for search-multi-selection field, bump deps.

# v0.0.4 2017-02-14

* Add tags field.

# v0.0.3 2017-02-14

* Fix errors uploading files in Safari.

# v0.0.2 2017-01-26

* Fix up references to other `formalist-` deps.

# v0.0.1 2017-01-23

First release.
