'use strict';

var themes = require('../tools/files-router').get('themes'),
    _      = require('underscore');

var themeOptions = {};
_.each(themes, function (theme, name) {
    themeOptions[name] = {
        "src": "<%= combo.autopath(\""+name+"\", path.pub ) %>css/styles.css"
    };
});

var postCssOptions = {
    options: {
        map: true,
        processors: [
            // require('cssnano'),
            require('postcss-import'),
            require('postcss-nesting')
        ]
    }
}

module.exports = _.extend(postCssOptions, themeOptions);
