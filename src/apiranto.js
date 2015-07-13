'use strict';

var fs = require('fs'),
  jade = require('jade'),
  mkdirp = require('mkdirp'),
  parser = require('swagger-parser'),
  path = require('path'),
  sass = require('node-sass');

module.exports.generate = function (definition, target, options, done) {
  options.baseDir = path.resolve(__dirname, '..');

  parseFile(definition, function (err, api) {
    if (err) {
      done(err);
      return;
    }

    buildDoc(api, target, options, function (err) {
      if (err) {
        done(err);
        return;
      }

      done(null);
    });
  });
};

function parseFile (file, done) {
  parser.parse(file, function (err, api, metadata) {
    if (err) {
      done(err);
      return;
    }

    done(null, api);
  });
}

function buildDoc (api, target, options, done) {
  var html = jade.renderFile(options.baseDir + '/templates/default.jade', {
    _: require('lodash'),
    api: api,
    markdown: require('marked')
  });

  fs.writeFile(path.resolve(target, 'index.html'), html, function (err) {
    if (err) {
      done(err);
      return;
    }

    buildAssets(target, options, function (err) {
      if (err) {
        done(err);
        return;
      }

      done(null);
    })
  });
}

function buildAssets (target, options, done) {
  sass.render({
    file: options.baseDir + '/assets/scss/style.scss',
    includePaths: [
      options.baseDir + '/node_modules/bootstrap-sass/assets/stylesheets'
    ]
  }, function (err, result) {
    if (err) {
      done(err);
      return;
    }

    mkdirp(path.resolve(target, 'css'), function (err) {
      if (err) {
        done(err);
        return;
      }

      fs.writeFile(path.resolve(target, 'css/style.css'), result.css.toString(), function (err) {
        if (err) {
          done(err);
          return;
        }

        done(null);
      });
    });
  });
}
