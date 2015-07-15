'use strict';

var _ = require('lodash'),
  fs = require('fs'),
  jade = require('jade'),
  mkdirp = require('mkdirp'),
  parser = require('swagger-parser'),
  path = require('path'),
  sass = require('node-sass');

module.exports = function (definition, target, options, done) {
  options.baseDir = path.resolve(__dirname, '../..');

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
  var groups = [];

  if (api.tags) {
    groups = groupByTags(api.paths, api.tags);
  } else {
    groups = [{
      name: 'default',
      description: 'API calls',
      paths: api.paths
    }];
  }

  var html = jade.renderFile(options.baseDir + '/templates/default.jade', {
    _: require('lodash'),
    api: api,
    groups: groups,
    helpers: {
      buildExample: require('../helpers/buildExample'),
      renderJson: require('../helpers/renderJson'),
      markdown: require('marked')
    }
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

function groupByTags (paths, tags) {
  var groups = [];

  _.forEach(tags, function (tag) {
    var group = {
      name: tag.name,
      description: tag.description,
      paths: {}
    };

    _.forEach(paths, function (methods, path) {
      var matches = _.transform(methods, function (result, call, method) {
        if (_.includes(call.tags, tag.name)) {
          result[method] = call;
        }
      });

      if (Object.keys(matches).length > 0) {
        group.paths[path] = matches;
      }
    });

    if (Object.keys(group.paths).length > 0) {
      groups.push(group);
    }
  });

  return groups;
};
