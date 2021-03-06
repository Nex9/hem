// Generated by CoffeeScript 1.6.3
(function() {
  var compileCoffeescript, compilers, cs, eco, err, fs, jade, path, stylus, nib
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  path = require('path');

  compilers = {};

  compilers.js = compilers.css = function(path) {
    return fs.readFileSync(path, 'utf8');
  };

  require.extensions['.css'] = function(module, filename) {
    var source;
    source = JSON.stringify(compilers.css(filename));
    return module._compile("module.exports = " + source, filename);
  };

  try {
    cs = require('coffee-script');
    compilers.coffee = function(path) {
      return compileCoffeescript(path);
    };
    compilers.litcoffee = function(path) {
      return compileCoffeescript(path, true);
    };
    compileCoffeescript = function(path, literate) {
      var err;
      if (literate == null) {
        literate = false;
      }
      try {
        return cs.compile(fs.readFileSync(path, 'utf8'), {
          filename: path,
          literate: literate
        });
      } catch (_error) {
        err = _error;
        err.message = "Coffeescript Error: " + err.message;
        err.path = "Coffeescript Path:  " + path;
        if (err.location) {
          err.path = err.path + ":" + (err.location.first_line + 1);
        }
        throw err;
      }
    };
  } catch (_error) {
    err = _error;
  }

  eco = require('eco');

  compilers.eco = function(path) {
    var content;
    try {
      content = eco.precompile(fs.readFileSync(path, 'utf8'));
    } catch (_error) {
      err = _error;
      err = new Error(err);
      err.message = "eco Error: " + err.message;
      err.path = "eco Path:  " + path;
      throw err;
    }
    return "var content = " + content + ";\nmodule.exports = content;";
  };

  compilers.jeco = function(path) {
    var content;
    try {
      content = eco.precompile(fs.readFileSync(path, 'utf8'));
    } catch (_error) {
      err = _error;
      err = new Error(err);
      err.message = "jeco Error: " + err.message;
      err.path = "jeco Path:  " + path;
      throw err;
    }
    return "module.exports = function(values, data){ \n  var $  = jQuery, result = $();\n  values = $.makeArray(values);\n  data = data || {};\n  for(var i=0; i < values.length; i++) {\n    var value = $.extend({}, values[i], data, {index: i});\n    var elem  = $((" + content + ")(value));\n    elem.data('item', value);\n    $.merge(result, elem);\n  }\n  return result;\n};";
  };

  require.extensions['.jeco'] = require.extensions['.eco'];

  compilers.html = function(path) {
    var content;
    content = fs.readFileSync(path, 'utf8');
    return "module.exports = " + (JSON.stringify(content)) + ";\n";
  };

  require.extensions['.html'] = function(module, filename) {
    return module._compile(compilers.html(filename), filename);
  };

  try {
    jade = require('jade');
    compilers.jade = function(path) {
      var content, ex, jCompiler, source, template;
      content = fs.readFileSync(path, 'utf8');
      try {
        jCompiler = jade.compileClient || jade.compile;
        template = jCompiler(content, {
          filename: path,
          compileDebug: compilers.DEBUG,
          client: true
        });
        source = template.toString();
        return "module.exports = " + source + ";";
      } catch (_error) {
        ex = _error;
        throw new Error("" + ex + " in " + path);
      }
    };
    require.extensions['.jade'] = function(module, filename) {
      return module._compile(compilers.jade(filename), filename);
    };
  } catch (_error) {
    err = _error;
  }

  try {
    stylus = require('stylus');
    nib = require('nib');
    compilers.styl = function(_path) {
      var content, result;
      content = fs.readFileSync(_path, 'utf8');
      result = '';
      stylus(content).include(path.dirname(_path)).use(nib()).set('include css', (__indexOf.call(process.argv, '--includeCss') >= 0)).set('compress', !compilers.DEBUG).render(function(err, css) {
        if (err) {
          throw err;
        }
        return result = css;
      });
      return result;
    };
    require.extensions['.styl'] = function(module, filename) {
      var source;
      source = JSON.stringify(compilers.styl(filename));
      return module._compile("module.exports = " + source, filename);
    };
  } catch (_error) {
    err = _error;
  }

  module.exports = compilers;

}).call(this);
