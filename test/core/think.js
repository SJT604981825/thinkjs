'use strict';

var assert = require('assert');
var thinkit = require('thinkit');
var path = require('path');


for(var filepath in require.cache){
  delete require.cache[filepath];
}
var Index = require('../../lib/index.js');
var instance = new Index();
instance.load();


think.APP_PATH = path.dirname(__dirname) + '/testApp';


var _http = require('../_http.js');

function getHttp(config, options){
  think.APP_PATH = path.dirname(__dirname) + '/testApp';
  var req = think.extend({}, _http.req);
  var res = think.extend({}, _http.res);
  return think.http(req, res).then(function(http){
    if(config){
      http._config = config;
    }
    if(options){
      for(var key in options){
        http[key] = options[key];
      }
    }
    return http;
  })
}



describe('core/think.js', function(){
  before(function(){
    think.cli = false;
    think.mode = think.mode_mini;
    think.module = [];
  })

  it('methods from thinkit', function(){
    for(var name in thinkit){
      assert.equal(typeof think[name] === 'function' || think[name] === thinkit[name], true);
    }
  })
  it('think.startTime is number', function(){
    assert.equal(typeof think.startTime, 'number')
  })
  it('think.dirname', function(){
    assert.deepEqual(think.dirname, {
      config: 'config',
      controller: 'controller',
      model: 'model',
      adapter: 'adapter',
      logic: 'logic',
      service: 'service',
      view: 'view',
      middleware: 'middleware',
      runtime: 'runtime',
      common: 'common',
      bootstrap: 'bootstrap',
      local: 'local'
    })
  })
  it('think.debug is boolean', function(){
    assert.equal(typeof think.debug, 'boolean');
  })
  it('think.port is number', function(){
    assert.equal(typeof think.port, 'number');
  })
  it('think.cli is boolean', function(){
    assert.equal(typeof think.cli, 'boolean');
  })

  it('think.mode is 1', function(){
    assert.equal(think.mode, 1);
  })
  it('think.mode_mini is 1', function(){
    assert.equal(think.mode_mini, 1);
  })
  it('think.mode_normal is 2', function(){
    assert.equal(think.mode_normal, 2);
  })
  it('think.mode_module is 4', function(){
    assert.equal(think.mode_module, 4);
  })

  it('think.THINK_LIB_PATH is string', function(){
    assert.equal(typeof think.THINK_LIB_PATH, 'string');
  })
  it('think.THINK_PATH is string', function(){
    assert.equal(typeof think.THINK_PATH, 'string');
  })
  it('think.version is string', function(){
    assert.equal(typeof think.version, 'string');
  })
  it('think.module is empty array', function(){
    assert.deepEqual(think.module, []);
  })

  it('think.base is class', function(){
    assert.deepEqual(typeof think.base, 'function');
  })
  it('think.base methods', function(){
    var instance = new think.base();
    var methods = ['init', 'invoke', 'config', 'action', 'cache', 'hook', 'model', 'controller', 'service'];
    methods.forEach(function(item){
      assert.deepEqual(typeof instance.init, 'function');
    })
  })
  it('think.defer is function', function(){
    assert.equal(typeof think.defer, 'function')
  })
  it('think.defer methods', function(){
    var deferred = think.defer();
    assert.equal(typeof deferred.promise, 'object')
    assert.equal(typeof deferred.resolve, 'function')
    assert.equal(typeof deferred.reject, 'function')
  })
  it('think.reject is function', function(){
    assert.equal(typeof think.reject, 'function')
  })
  it('think.reject methods', function(done){
    var err = new Error('reject error');
    var timeout = global.setTimeout;
    global.setTimeout = function(callback, timeout){
      assert.equal(timeout, 500);
    }
    var reject = think.reject(err);
    reject.catch(function(e){
      assert.equal(err, e);
      global.setTimeout = timeout;
      done();
    })
  })

  it('think.isHttp', function(){
    assert.equal(think.isHttp(), false);
    assert.equal(think.isHttp(null), false);
    assert.equal(think.isHttp([]), false);
    assert.equal(think.isHttp({}), false);
    assert.equal(think.isHttp({req: {}, res: {}}), true);
  })
  it('think.co is function', function(){
    assert.equal(typeof think.co, 'function');
    assert.equal(typeof think.co.wrap, 'function');
  })
  describe('think.Class', function(){
    it('think.Class is function', function(){
      assert.equal(typeof think.Class, 'function');
    })
    it('think.Class({})', function(){
      var cls = think.Class({});
      var instance = new cls();
      assert.equal('__initReturn' in instance, true);
      assert.equal(typeof instance.config, 'function');
      assert.equal(typeof instance.controller, 'function');
    })
    it('think.Class({}, true)', function(){
      var cls = think.Class({}, true);
      var instance = new cls();
      assert.equal('__initReturn' in instance, false);
      assert.equal(typeof instance.config, 'undefined');
      assert.equal(typeof instance.controller, 'undefined');
    })
    it('think.Class(function)', function(){
      var A = function(){}
      A.prototype = {
        test: function(){
          return 'test'
        }
      }
      var cls = think.Class(A);
      var instance = new cls();
      assert.equal('__initReturn' in instance, false);
      assert.equal(typeof instance.test, 'function');
      assert.equal(instance.test(), 'test');
      assert.equal(typeof instance.controller, 'undefined');
    })
    it('think.Class(function, {})', function(){
      var A = function(){}
      A.prototype = {
        test: function(){
          return 'test';
        }
      }
      var cls = think.Class(A, {
        getName: function(){
          return this.test();
        }
      });
      var instance = new cls();
      assert.equal('__initReturn' in instance, false);
      assert.equal(typeof instance.test, 'function');
      assert.equal(instance.test(), 'test');
      assert.equal(typeof instance.controller, 'undefined');
      assert.equal(instance.getName(), 'test');
    })
    describe('think.Class("controller")', function(){
      it('controller is a function', function(){
        var fn = think.Class('controller');
        assert.equal(typeof fn, 'function');
      })
      it('controller({}) is a function', function(){
        var fn = think.Class('controller');
        var cls = fn({});
        assert.equal(typeof cls, 'function');
      })
      it('controller() is function', function(){
        var fn = think.Class('controller');
        var cls2 = fn();
        assert.equal(typeof cls2, 'function');
      })
      it('controller("controller_base") is function', function(){
        var fn = think.Class('controller');
        var cls2 = fn('controller_base');
        assert.equal(typeof cls2, 'function');
      })
      it('controller(superClass)', function(){
        var fn = think.Class('controller');
        var A = function(){}
        A.prototype = {
          test: function(){
            return 'test';
          }
        }
        var cls = fn(A);
        assert.equal(typeof cls, 'function');
        var instance = new cls();
        assert.equal(instance.test(), 'test');
      })
    })
  })
  describe('think.lookClass', function(){
    it('think.lookClass("module/not/found") not found', function(){
      try{
        think.lookClass('module/not/found')
      }catch(e){
        var message = e.message;
        assert.equal(message.indexOf('module/not/found') > -1, true);
      }
    })
    it('think.lookClass("module/is/exist") is function', function(){
      thinkCache(thinkCache.ALIAS_EXPORT, 'module/is/exist', function(){
        return 'module/is/exist';
      })
      var fn = think.lookClass('module/is/exist');
      assert.equal(fn(), 'module/is/exist');
      thinkCache(thinkCache.ALIAS_EXPORT, 'module/is/exist', null);
    })
    it('think.lookClass("home/group", "controller") not found', function(){
      try{
        think.lookClass("home/group", "controller")
      }catch(e){
        assert.equal(e.message.indexOf('home/controller/group') > -1, true);
      }
    })
    it('think.lookClass("home/group", "service") is function', function(){
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/service/group', function(){
        return 'home/service/group';
      })
      var fn = think.lookClass("home/group", "service");
      assert.equal(fn(), 'home/service/group');
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/service/group', null);
    })
    it('think.lookClass("detail", "controller", "homwwwe") not found', function(){
      var cls = think.lookClass('detail', 'controller', 'homwwwe', 'homwwww');
      assert.equal(cls, null);
    })
    it('think.lookClass("group", "controller", "home") is function', function(){
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/controller/group', function(){
        return 'home/controller/group';
      })
      var fn = think.lookClass('group', 'controller', 'home');
      assert.equal(fn(), 'home/controller/group');
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/controller/group', null);
    })
    it('think.lookClass("group", "controller", "home1") is function', function(){
      var mode = think.mode;
      think.mode = think.mode_module;
      thinkCache(thinkCache.ALIAS_EXPORT, 'common/controller/group', function(){
        return 'common/controller/group';
      })
      var fn = think.lookClass('group', 'controller', 'home1');
      assert.equal(fn(), 'common/controller/group');
      think.mode = mode;
      thinkCache(thinkCache.ALIAS_EXPORT, 'common/controller/group', null);
    })
  })

  describe('think.getPath', function(){
    it('think.getPath is function', function(){
      assert.equal(think.isFunction(think.getPath), true);
    })
    it('mode mini', function(){
      var mode = think.mode;
      think.mode = think.mode_mini;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';

      var path = think.getPath();
      assert.equal(path, '/path/to/project/app/controller');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode mini with model', function(){
      var mode = think.mode;
      think.mode = think.mode_mini;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';

      var path = think.getPath(think.dirname.common, think.dirname.model);
      assert.equal(path, '/path/to/project/app/model');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode mini with view', function(){
      var mode = think.mode;
      think.mode = think.mode_mini;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';

      var path = think.getPath(think.dirname.common, think.dirname.view);
      assert.equal(path, '/path/to/project/app/view');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode normal', function(){
      var mode = think.mode;
      think.mode = think.mode_normal;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      think.config('default_module', 'home')
      var path = think.getPath();
      assert.equal(path, '/path/to/project/app/controller/home');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode normal with model', function(){
      var mode = think.mode;
      think.mode = think.mode_normal;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      think.config('default_module', 'home')
      var path = think.getPath(undefined, think.dirname.model);
      assert.equal(path, '/path/to/project/app/model/home');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode normal with view', function(){
      var mode = think.mode;
      think.mode = think.mode_normal;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      think.config('default_module', 'home')
      var path = think.getPath(undefined, think.dirname.view);
      assert.equal(path, '/path/to/project/app/view/home');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode normal with view & module', function(){
      var mode = think.mode;
      think.mode = think.mode_normal;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      think.config('default_module', 'home')
      var path = think.getPath('welefen', think.dirname.view);
      assert.equal(path, '/path/to/project/app/view/welefen');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode module', function(){
      var mode = think.mode;
      think.mode = think.mode_module;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      var path = think.getPath();
      assert.equal(path, '/path/to/project/app/common/controller');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode module with model', function(){
      var mode = think.mode;
      think.mode = think.mode_module;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      var path = think.getPath(undefined, think.dirname.model);
      assert.equal(path, '/path/to/project/app/common/model');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
    it('mode module with model & module', function(){
      var mode = think.mode;
      think.mode = think.mode_module;
      var APP_PATH = think.APP_PATH;
      think.APP_PATH = '/path/to/project/app';
      var path = think.getPath('test', think.dirname.model);
      assert.equal(path, '/path/to/project/app/test/model');
      think.mode = mode;
      think.APP_PATH = APP_PATH;
    })
  })
  
  describe('think.require', function(){
    it('think.require is function', function(){
      assert.equal(think.isFunction(think.require), true)
    })
    it('think.require({})', function(){
      var data = think.require({});
      assert.deepEqual(data, {})
    })
    it('think.require is in aliasExport', function(){
      var data = thinkCache(thinkCache.ALIAS_EXPORT);
      var fn = function(){};
      thinkCache(thinkCache.ALIAS_EXPORT, {
        '_test_': fn
      })
      var result = think.require('_test_')
      assert.equal(result, fn);
      thinkCache(thinkCache.ALIAS_EXPORT, data);
    })
    it('think.require is in alias', function(){
      var data = thinkCache(thinkCache.ALIAS);
      thinkCache(thinkCache.ALIAS, {
        '_test_': __filename + '/a.js'
      })
      var result = think.require('_test_');
      assert.equal(result, null);
      thinkCache(thinkCache.ALIAS, data);
    })
    it('think.require is in _alias', function(){
      var data = thinkCache(thinkCache.ALIAS);
      thinkCache(thinkCache.ALIAS, {
        '_test_': path.normalize(__dirname + '/../../lib/index.js')
      })
      var result = think.require('_test_');
      assert.equal(think.isFunction(result), true)
      thinkCache(thinkCache.ALIAS, data);
    })

    it('think.require is not in _alias, try it', function(){
      try{
        var result = think.require('_test_ww');
        assert.equal(1, 2)
      }catch(e){
        assert.equal(true, true)
      }
    })
    it('think.require is not in _alias, return null', function(){
      var result = think.require('_test_ww', true);
      assert.equal(result, null)
    })
    it('think.require is not in _alias, mime module', function(){
      var result = think.require('mime');
      assert.equal(think.isObject(result), true)
    })


  })

  describe('think.safeRequire', function(){
    it('think.safeRequire is function', function(){
      assert.equal(think.isFunction(think.safeRequire), true)
    })
    it('think.safeRequire absoslute file not exist', function(){
      var data = think.safeRequire('/dddd');
      assert.equal(data, null)
    })
    it('think.safeRequire relative file not exist', function(){
      var log = think.log;
      think.log = function(err){
        assert.equal(err.message, "Cannot find module 'dddd/aaa.js'");
      }
      var data = think.safeRequire('dddd/aaa.js');
      assert.equal(data, null);
      think.log = log;
    })

  })

  describe('think.prevent', function(){
    it('think.prevent is function', function(){
      assert.equal(think.isFunction(think.prevent), true)
    })
    it('think.prevent', function(done){
      think.prevent().catch(function(err){
        assert.equal(err.message, 'PREVENT_NEXT_PROCESS');
        done();
      })
    })
  })
  describe('think.isPrevent', function(){
    it('think.isPrevent is function', function(){
      assert.equal(think.isFunction(think.isPrevent), true)
    })
    it('think.isPrevent', function(done){
      think.prevent().catch(function(err){
        assert.equal(think.isPrevent(err), true);
        done();
      })
    })
  })


  describe('think.log', function(){
    it('think.log is function', function(){
      assert.equal(think.isFunction(think.log), true)
    })
    it('think.log', function(){
      var log = console.log;
      console.log = function(msg){
        assert.equal(msg.indexOf('test') > -1, true)
      }
      think.log('test');
      console.log = log;
    })
    it('think.log with type', function(){
      var log = console.log;
      console.log = function(msg){
        assert.equal(msg.indexOf('test') > -1, true);
        assert.equal(msg.indexOf('[TEST]') > -1, true);
      }
      think.log('test', 'TEST');
      console.log = log;
    })
    it('think.log with function', function(){
      var log = console.log;
      console.log = function(msg){
        assert.equal(msg.indexOf('test') > -1, true);
        assert.equal(msg.indexOf('[TEST]') > -1, true);
      }
      think.log(function(){
        return 'test';
      }, 'TEST');
      console.log = log;
    })
    it('think.log with error', function(){
      var log = console.error;
      console.error = function(msg){
        assert.equal(msg.indexOf('test') > -1, true);
      }
      think.log(new Error('test'));
      console.error = log;
    })
    it('think.log with prevent', function(done){
      var error = console.error;
      console.error = function(){
        assert.equal(1, 2);
      }
      think.prevent().catch(function(err){
        think.log(err);
        console.error = error;
        done();
      })
    })
  })

  describe('think.config', function(){
    it('think.config is function', function(){
      assert.equal(think.isFunction(think.config), true);
    })
    it('think.config get all data', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {name: 'welefen'})
      var result = think.config();
      assert.deepEqual(result, {name: 'welefen'});
      thinkCache(thinkCache.CONFIG, data);
    })
    it('think.config set data', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config({name: 'welefen'});
      var result = think.config();
      assert.deepEqual(result, {name: 'welefen'});
      thinkCache(thinkCache.CONFIG, data);
    })
    it('think.config get data', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config({name: 'welefen'});
      var result = think.config('name');
      assert.deepEqual(result, 'welefen');
      thinkCache(thinkCache.CONFIG, data);
    })
    it('think.config set data with value', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config('name', 'welefen');
      var result = think.config('name');
      assert.deepEqual(result, 'welefen');
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 2', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config('name.value', 'welefen');
      var result = think.config('name.value');
      assert.deepEqual(result, 'welefen');
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 3', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config('name.value', 'welefen');
      var result = think.config('name');
      assert.deepEqual(result, {value: 'welefen'});
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 4', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config('name.value', 'welefen');
      think.config('name.test', 'suredy')
      var result = think.config('name');
      assert.deepEqual(result, {value: 'welefen', test: 'suredy'});
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 5', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config('name.value', 'welefen');
      var result = think.config('name.value111');
      assert.deepEqual(result, undefined);
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 6', function(){
      var data = thinkCache(thinkCache.CONFIG)
      thinkCache(thinkCache.CONFIG, {})
      think.config('name.value', 'welefen');
      var result = think.config('name1111.value111');
      assert.deepEqual(result, undefined);
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config set data with value 7', function(){
      var data = thinkCache(thinkCache.CONFIG);
      thinkCache(thinkCache.CONFIG, {})
      think.config([]);
      var result = think.config('name1111.value111');
      assert.deepEqual(result, undefined);
      thinkCache(thinkCache.CONFIG, data)
    })
    it('think.config get value with data', function(){
      var result = think.config('name', undefined, {name: 'welefen'});
      assert.deepEqual(result, 'welefen');
    })
    it('think.config set value with data', function(){
      var data = {name: 'welefen'};
      think.config('name', 'suredy', data);
      assert.deepEqual(data, {name: 'suredy'});
    })
    it('think.config set value with data 2', function(){
      var data = {name: 'welefen'};
      think.config('name1', 'suredy', data);
      assert.deepEqual(data, {name: 'welefen', name1: 'suredy'});
    })
  })


  describe('think.getModuleConfig', function(){
      it('think.getModuleConfig is function', function(){
        assert.equal(think.isFunction(think.getModuleConfig), true);
      })
      it('think.getModuleConfig get sys config', function(){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var configs = think.getModuleConfig(true);
        assert.deepEqual(Object.keys(configs).sort(), [ 'action_suffix', 'cache', 'call_controller', 'callback_name', 'cluster_on', 'cookie', 'create_server', 'db', 'default_action', 'default_controller', 'default_module', 'deny_module_list', 'encoding', 'error', 'gc', 'hook_on', 'host', 'html_cache', 'json_content_type', 'local', 'log_pid', 'log_request', 'memcache', 'output_content', 'package', 'pathname_prefix', 'pathname_suffix', 'port', 'post', 'proxy_on', 'redis', 'resource_on', 'resource_reg', 'route_on', 'session', 'subdomain', 'timeout', 'token', 'tpl', 'validate', 'websocket' ]);
        assert.equal(think.isObject(configs), true);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
      })
      it('think.getModuleConfig get sys config 2', function(){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var configs = think.getModuleConfig(true);
        var configs2 = think.getModuleConfig(true);
        assert.equal(configs, configs2);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
      })
      it('think.getModuleConfig get sys config, with cli', function(){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var cli = think.cli;
        think.cli = true;
        var configs = think.getModuleConfig(true);
        assert.equal(think.isObject(configs), true);
        assert.equal(configs.auto_reload, false);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.cli = cli;
      })
      it('think.getModuleConfig get sys config, with debug', function(){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var debug = think.debug;
        think.debug = true;
        var configs = think.getModuleConfig(true);
        assert.equal(think.isObject(configs), true);
        assert.equal(configs.auto_reload, true);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.debug = debug;
      })
      it('think.getModuleConfig get common config', function(){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var debug = think.debug;
        think.debug = true;
        var configs = think.getModuleConfig();
        assert.equal(think.isObject(configs), true);
        assert.equal(configs.auto_reload, false);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.debug = debug;
      })

      it('think.getModuleConfig get common config 2', function(done){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var appPath = think.APP_PATH + '/config/';
        think.mkdir(appPath);

        var fs = require('fs');
        fs.writeFileSync(appPath + '/config.js', 'module.exports = {welefen: "suredy"}');
        think.mode = think.mode_mini;
        var configs = think.getModuleConfig();
        assert.equal(configs.welefen, 'suredy');
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.rmdir(think.APP_PATH).then(done);
      })
      it('think.getModuleConfig get common config 3', function(done){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var appPath = think.APP_PATH + '/config/';
        think.mkdir(appPath);

        var fs = require('fs');
        fs.writeFileSync(appPath + '/aaa.js', 'module.exports = {welefen: "suredy"}');
        think.mode = think.mode_mini;
        var configs = think.getModuleConfig();
        assert.deepEqual(configs.aaa, {welefen: 'suredy'});
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.rmdir(think.APP_PATH).then(done);
      })
      it('think.getModuleConfig get common config 4', function(done){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        var appPath = think.APP_PATH + '/config/';
        think.mkdir(appPath);

        var fs = require('fs');
        fs.writeFileSync(appPath + '/_aaa.js', 'module.exports = {welefen: "suredy"}');
        think.mode = think.mode_mini;
        var configs = think.getModuleConfig();
        assert.deepEqual(configs.aaa, undefined);
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        think.rmdir(think.APP_PATH).then(done);
      })
      it('think.getModuleConfig get common config 5', function(done){
        var _moduleConfig = thinkCache(thinkCache.MODULE_CONFIG);
        var _config = thinkCache(thinkCache.CONFIG);
        thinkCache(thinkCache.MODULE_CONFIG, {})
        thinkCache(thinkCache.CONFIG, {})
        var appPath = think.APP_PATH + '/config/local';
        think.mkdir(appPath);

        var fs = require('fs');
        fs.writeFileSync(appPath + '/en.js', 'module.exports = {welefen: "suredy"}');
        think.mode = think.mode_mini;
        var configs = think.getModuleConfig();
        assert.deepEqual(configs.local, { en: { welefen: 'suredy' } });
        thinkCache(thinkCache.MODULE_CONFIG, _moduleConfig)
        thinkCache(thinkCache.CONFIG, _config);
        think.rmdir(think.APP_PATH).then(done);
      })
  })

  describe('think.hook', function(){
    it('get all hook', function(){
      var data = Object.keys(thinkCache(thinkCache.HOOK)).sort();
      assert.deepEqual(data, ["app_begin","app_end","app_error","form_parse","resource_check","resource_output","route_parse","view_end","view_filter","view_init","view_parse","view_template"])
    })
    it('get item hook', function(){
      var data = think.hook('route_parse');
      assert.deepEqual(data, ['rewrite_pathname', 'subdomain_deploy', 'route'])
    })
    it('get item hook, not exist', function(){
      var data = think.hook('route_parse111');
      assert.deepEqual(data, [])
    })
    it('set hook data, array', function(){
      think.hook('test', ['welefen']);
      assert.deepEqual(think.hook('test'), ['welefen']);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('set hook data, array 1', function(){
      thinkCache(thinkCache.HOOK, 'test', ['suredy'])
      think.hook('test', ['welefen']);
      assert.deepEqual(think.hook('test'), ['welefen']);
      thinkCache(thinkCache.HOOK, 'test', null)
    })
    it('set hook data, append', function(){
      thinkCache(thinkCache.HOOK, 'test', ['suredy'])
      think.hook('test', ['welefen'], 'append');
      assert.deepEqual(think.hook('test'), ['suredy', 'welefen']);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('set hook data, prepend', function(){
      thinkCache(thinkCache.HOOK, 'test', ['suredy'])
      think.hook('test', ['welefen'], 'prepend');
      assert.deepEqual(think.hook('test'), ['welefen', 'suredy']);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('remove hook data', function(){
      thinkCache(thinkCache.HOOK, 'test', ['suredy'])
      think.hook('test', null);
      assert.deepEqual(think.hook('test'), []);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('add hook, append', function(){
      think.hook('__test', 'welefen');
      assert.deepEqual(think.hook('__test'), ['welefen']);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('add hook, function', function(){
      var fn = function(){};
      think.hook('__test', fn);
      var data = think.hook('__test');
      assert.equal(data[0].length, 43);
      var fn1 = think.middleware(data[0]);
      assert.equal(fn, fn1);
      thinkCache(thinkCache.HOOK, 'test', null);
    })
    it('exec hook, emtpy', function(done){
      getHttp().then(function(http){
        think.hook('__not_exist', http, '__not_exist').then(function(data){
          assert.equal(data, '__not_exist');
          done();
        })
      })
    })

    it('exec hook', function(done){
      think.hook('__test__', function(http, data){
        return data;
      })
      getHttp().then(function(http){
        think.hook('__test__', http, '__test__').then(function(data){
          assert.equal(data, '__test__');
          thinkCache(thinkCache.HOOK, '__test__', null)
          
          done();
        })
      })
    })

    it('exec hook, no return', function(done){
      think.hook('__test__', function(http, data){
        return 'test';
      })
      think.hook('__test__', function(http, data){
        return;
      }, 'append')
      getHttp().then(function(http){
        think.hook('__test__', http, '__test__').then(function(data){
          assert.equal(data, 'test');
          thinkCache(thinkCache.HOOK, '__test__', null)
          done();
        })
      })
    })

    it('exec hook, class', function(done){
      var cls = think.Class({
        init: function(){

        },
        run: function(){
          return 'run';
        }
      }, true)
      think.hook('__test__', cls);
      getHttp().then(function(http){
        think.hook('__test__', http, '__test__').then(function(data){
          assert.equal(data, 'run');
          thinkCache(thinkCache.HOOK, '__test__', null)
          done();
        })
      })
    })
  })

  describe('think.middleware', function(){
    it('register middleware, function', function(){
      var fn = function(){}
      var data = think.middleware('___test', fn)
      assert.equal(thinkCache(thinkCache.MIDDLEWARE, '___test'), fn);
      assert.equal(data, undefined);
      thinkCache(thinkCache.MIDDLEWARE, '___test', null)
      
    })
    it('register middleware, class', function(){
      var fn = think.Class({
        run: function(){}
      }, true)
      var data = think.middleware('___test', fn)
      assert.equal(thinkCache(thinkCache.MIDDLEWARE, '___test'), fn);
      assert.equal(data, undefined);
      thinkCache(thinkCache.MIDDLEWARE, '___test', null)
    })
    it('exec middleware, no data', function(done){
      think.middleware('___test', function(){
        return 'http';
      })
      getHttp().then(function(http){
        think.middleware('___test', http).then(function(data){
          assert.equal(data, 'http');
          thinkCache(thinkCache.MIDDLEWARE, '___test', null)
          done();
        })
      })
    })
    it('exec middleware, with data', function(done){
      think.middleware('___test', function(http, data){
        return data;
      })
      getHttp().then(function(http){
        think.middleware('___test', http, '___http').then(function(data){
          assert.equal(data, '___http');
          thinkCache(thinkCache.MIDDLEWARE, '___test', null)
          done();
        })
      })
    })
    it('exec middleware, not exist', function(done){
      getHttp().then(function(http){
        return think.middleware('___testxxx', http, '___http').catch(function(err){
          assert.equal(err.stack.indexOf('`___testxxx`') > -1, true);
          thinkCache(thinkCache.MIDDLEWARE, '___test', null)
          done();
        })
      })
    })
    it('exec middleware, function', function(done){
      getHttp().then(function(http){
        return think.middleware(function(http, data){
          return data;
        }, http, '___http').then(function(data){
          assert.equal(data, '___http');
          done();
        })
      })
    })
    it('exec middleware, object', function(){
      getHttp().then(function(http){
        var data = think.middleware({
          getNwwwwame: function(){
            return 'test';
          }
        }, http, '___http');
        assert.equal(think.isFunction(data.prototype.getNwwwwame), true);
      })
    })
    it('get middleware', function(){
      var fn = function(){};
      think.middleware('fasdfasf', fn);
      var fn1 = think.middleware("fasdfasf");
      assert.equal(fn1, fn);
      thinkCache(thinkCache.MIDDLEWARE, 'fasdfasf')
    })
    it('get sys middleware', function(){
      var fn1 = think.middleware("deny_ip");
      assert.equal(think.isFunction(fn1), true);
    })
    it('get sys middleware, not found', function(){
      try{
        var fn1 = think.middleware("deny_ip11");
      }catch(err){
        assert.equal(err.stack.indexOf('`deny_ip11`') > -1, true);
      }
    })
    it('create middleware', function(){
      var cls = think.middleware({
        getTest: function(){
          return 'getTest';
        }
      })
      assert.equal(think.isFunction(cls.prototype.getTest), true);
      var instance = new cls({});
      assert.equal(instance.getTest(), 'getTest');
    })
    it('create middleware, superClass', function(){
      var superClass = think.middleware({
        getTest: function(){
          return 'getTest';
        }
      })
      var childClass = think.middleware(superClass, {
        getTest2: function(){
          return 'getTest2';
        }
      })
      assert.equal(think.isFunction(childClass.prototype.getTest), true);
      var instance = new childClass({});
      assert.equal(instance.getTest(), 'getTest');
      assert.equal(instance.getTest2(), 'getTest2');
    })

  })

  describe('think.uuid', function(){
    it('is function', function(){
      assert.equal(think.isFunction(think.uuid), true)
    })
    it('default length is 32', function(){
      var data = think.uuid();
      assert.equal(data.length, 32);
    })
    it('change length to 40', function(){
      var data = think.uuid(40);
      assert.equal(data.length, 40);
    })
  })

  describe('think.adapter', function(){
    it('add adapter', function(){
      var fn = function(){}
      var key = 'adapter_welefen_suredy';
      think.adapter('welefen', 'suredy', fn);
      var fn1 = thinkCache(thinkCache.ALIAS_EXPORT, key);
      assert.equal(fn, fn1);
      thinkCache(thinkCache.ALIAS_EXPORT, key, null);
    })
    it('create adapter', function(){
      var fn = think.adapter('session', 'base', {
        getTest1: function(){
          return '___getTest';
        }
      })
      assert.equal(think.isFunction(fn.prototype.getTest1), true);
      var instance = new fn();
      var data = instance.getTest1();
      assert.equal(data, '___getTest');
    })
    it('get adapter', function(){
      var fn = think.adapter('session', 'base');
      assert.equal(think.isFunction(fn), true);
      assert.equal(think.isFunction(fn.prototype.get), true);
    })
    it('get adapter, not found', function(){
      try{
        var fn = think.adapter('session', 'welefen111');
      }catch(err){
        assert.equal(err.stack.indexOf('`adapter_session_welefen111`') > -1, true);
      }
    })
    it('create adapter', function(){
      var fn = think.adapter('session', {
        getTest1: function(){
          return '___getTest';
        }
      })
      assert.equal(think.isFunction(fn.prototype.getTest1), true);
      var instance = new fn();
      var data = instance.getTest1();
      assert.equal(data, '___getTest');
    })
    it('create adapter', function(){
      var fn = think.adapter({});
      assert.equal(think.isFunction(fn), true);
    })
    it('create adapter, super', function(){
      var cls = think.Class({
        getName: function(){
          return 'super';
        }
      }, true)
      var fn = think.adapter(cls, {});
      assert.equal(think.isFunction(fn), true);
      assert.equal(think.isFunction(fn.prototype.getName), true);
    })
    it('create adapter, super', function(){
      var fn = think.adapter('adapter_session_base', {});
      assert.equal(think.isFunction(fn), true);
      assert.equal(think.isFunction(fn.prototype.get), true);
    })

  })

  describe('think.loadAdapter', function(){
    it('base', function(done){
      var mode = think.mode;
      var path = think.getPath(undefined, think.dirname.adapter);;
      think.mkdir(path);
      think.loadAdapter(true);
      think.rmdir(path).then(done);
    })
    it('extra adapter', function(done){
      var mode = think.mode;
      var path = think.getPath(undefined, think.dirname.adapter);;
      think.mkdir(path + '/welefentest');
      require('fs').writeFileSync(path + '/welefentest/base.js', 'module.exports=think.Class({}, true)')
      think.loadAdapter();
      assert.equal(think.isFunction(think.adapter.welefentest), true);
      delete think.adapter.welefentest;
      think.rmdir(path).then(done);
    })
  })

  describe('think.route', function(){
    it('clear route', function(){
      var routes = thinkCache(thinkCache.COLLECTION, 'route');
      think.route(null);
      assert.equal(thinkCache(thinkCache.COLLECTION, 'route'), undefined);
      thinkCache(thinkCache.COLLECTION, 'route', routes);
    })
    it('set routes, array', function(){
      var routes = thinkCache(thinkCache.COLLECTION, 'route');
      think.route(['welefen']);
      assert.deepEqual(thinkCache(thinkCache.COLLECTION, 'route'), ['welefen']);
      thinkCache(thinkCache.COLLECTION, 'route', routes);
    })
    it('route config exports is function', function(done){
      think.mode = think.mode_mini;
      var routes = thinkCache(thinkCache.COLLECTION, 'route');
      thinkCache(thinkCache.COLLECTION, 'route', null);

      delete require.cache[filepath];

      var filepath = think.getPath(undefined, think.dirname.config) + '/route.js';;
      think.mkdir(path.dirname(filepath));
      require('fs').writeFileSync(filepath, 'module.exports=function(){return ["welefen", "suredy"]}');

      think.route().then(function(data){
        assert.deepEqual(data, ['welefen', 'suredy']);
        thinkCache(thinkCache.COLLECTION, 'route', routes);
        think.rmdir(think.APP_PATH).then(done);
      });
    })
    it('route config exports is function 2', function(done){
      think.mode = think.mode_mini;
      var routes = thinkCache(thinkCache.COLLECTION, 'route');
      thinkCache(thinkCache.COLLECTION, 'route', null);

      var filepath = think.getPath(undefined, think.dirname.config) + '/route.js';;

      delete require.cache[filepath];

      think.mkdir(path.dirname(filepath));
      require('fs').writeFileSync(filepath, 'module.exports=function(){return ["welefen", "suredy", "1111"]}');

      think.route().then(function(data){
        assert.deepEqual(data, ['welefen', 'suredy', '1111']);
        thinkCache(thinkCache.COLLECTION, 'route', routes);
        think.rmdir(think.APP_PATH).then(done);
      });
    })
    it('route config exports is function, no return', function(done){
      think.mode = think.mode_mini;
      var routes = thinkCache(thinkCache.COLLECTION, 'route');
      thinkCache(thinkCache.COLLECTION, 'route', null);

      var filepath = think.getPath(undefined, think.dirname.config) + '/route.js';;

      delete require.cache[filepath];

      think.mkdir(path.dirname(filepath));
      require('fs').writeFileSync(filepath, 'module.exports=function(){return;}');

      think.route().then(function(data){
        assert.deepEqual(data, []);
        thinkCache(thinkCache.COLLECTION, 'route', routes);
        think.rmdir(think.APP_PATH).then(done);
      });
    })
  })

  describe('think.gc', function(){
    it('gc off', function(){
      var on = think.config('gc.on');
      think.config('gc.on', false);
      var Cls = think.Class({gcType: 'test'}, true);
      var data = think.gc(new Cls);
      assert.equal(data, undefined);
      think.config('gc.on', on);
    })
    it('timers', function(done){
      think.config('gc.on', true);
      var interval = global.setInterval;
      global.setInterval = function(fn, inter){
        assert.equal(inter, 3600000);
        assert.equal(think.isFunction(fn), true);
        fn();
        global.setInterval = interval;
        done();
      }
      var Cls = think.Class({gcType: 'test', gc: function(){}}, true);
      var data = think.gc(new Cls);
    })
    it('timers, filter', function(done){
      think.config('gc.on', true);
      var filter = think.config('gc.filter');
      think.config('gc.filter', function(){
        return true;
      })
      var interval = global.setInterval;
      global.setInterval = function(fn, inter){
        assert.equal(inter, 3600000);
        assert.equal(think.isFunction(fn), true);
        var data = fn();
        assert.equal(data, 'gc');
        think.config('gc.filter', filter);
        global.setInterval = interval;
        done();
      }
      var Cls = think.Class({gcType: 'test', gc: function(){
        return 'gc';
      }}, true);
      var data = think.gc(new Cls);
    })
  })

  describe('think._http', function(){
    it('json stringify, with url', function(){
      var data = {url: "/welefen/suredy"};
      var result = think._http(JSON.stringify(data));
      assert.equal(result.req.url, "/welefen/suredy");
      assert.equal(result.req.method, 'GET');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('json stringify, without url', function(){
      var data = {method: "post"};
      var result = think._http(JSON.stringify(data));
      assert.equal(result.req.url, "/");
      assert.equal(result.req.method, 'POST');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('json stringify, url.parse', function(){
      var data = 'url=/welefen/suredy&method=delete';
      var result = think._http(data);
      assert.equal(result.req.url, "/welefen/suredy");
      assert.equal(result.req.method, 'DELETE');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('data is string', function(){
      var data = '/welefen/suredy';
      var result = think._http(data);
      assert.equal(result.req.url, "/welefen/suredy");
      assert.equal(result.req.method, 'GET');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('data is obj', function(){
      var data = {url: '/welefen/suredy'};
      var result = think._http(data);
      assert.equal(result.req.url, "/welefen/suredy");
      assert.equal(result.req.method, 'GET');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('data empty', function(){
      var result = think._http();
      assert.equal(result.req.url, "/");
      assert.equal(result.req.method, 'GET');
      assert.equal(result.req.httpVersion, '1.1')
    })
    it('end is function', function(){
      var result = think._http();
      assert.equal(think.isFunction(result.res.end), true);
      assert.equal(result.res.end(), undefined)
    })
  })

  describe('think.http', function(){
    it('get monitor http', function(done){
      think.http('/welefen/suredy').then(function(http){
        assert.equal(http.url, '/welefen/suredy');
        done();
      })
    })
  })

  describe('think.getModule', function(){
    it('get default module', function(){
      var module = think.getModule();
      assert.equal(module, 'home');
    })
    it('get mode_mini module', function(){
      think.mode = think.mode_mini;
      var module = think.getModule('test');
      assert.equal(module, 'home');
    })
    it('get  module', function(){
      think.mode = think.mode_normal;
      var module = think.getModule('test');
      assert.equal(module, 'test');
      think.mode = think.mode_mini;
    })
  })

  describe('think.getController', function(){
    it('get default controller', function(){
      var controller = think.getController();
      assert.equal(controller, 'index');
    })
    it('get controller', function(){
      var controller = think.getController('TEST');
      assert.equal(controller, 'test');
    })
    it('get invalid controller', function(){
      var controller = think.getController('011test');
      assert.equal(controller, '');
    })
  })

  describe('think.getAction', function(){
    it('get default action', function(){
      var action = think.getAction();
      assert.equal(action, 'index');
    })
    it('get action', function(){
      var action = think.getAction('TEST');
      assert.equal(action, 'TEST');
    })
    it('get invalid action', function(){
      var action = think.getAction('011test');
      assert.equal(action, '');
    })
  })

  describe('think.local', function(){
    it('base', function(){
      var msg = think.local('CONTROLLER_NOT_FOUND', 'welefen');
      assert.equal(msg.indexOf('`welefen`') > -1, true)
    })
    it('key not found', function(){
      var msg = think.local('KEY_NOT_FOUND');
      assert.equal(msg, 'KEY_NOT_FOUND')
    })
    it('lang is empty', function(){
      var lang = think.lang;
      think.lang = '';
      var msg = think.local('CONTROLLER_NOT_FOUND', 'welefen');
      assert.equal(msg.indexOf('`welefen`') > -1, true);
      think.lang = lang;
    })
  })

  describe('think.npm', function(){
    it('package is exist', function(done){
      think.npm('multiparty').then(function(data){
        assert.equal(think.isFunction(data.Form), true);
        done();
      })
    })
    it('install package redis', function(done){
      var log = think.log;
      think.log = function(){};
      var exec = require('child_process').exec;
      var trequire = think.require;
      var flag = false;
      think.require = function(){
        if(flag){
          return {
            Client: function(){}
          };
        }
        throw new Error('require error')
      }
      require('child_process').exec = function(cmd, options, callback){
        assert.equal(cmd, 'npm install package-not-exist');
        flag = true;
        callback && callback();
      }

      think.npm('package-not-exist').then(function(data){
        require('child_process').exec = exec;
        think.require = trequire;
        think.log = log;

        assert.equal(think.isFunction(data.Client), true);
        done();
      })
      
    })
    it('install package redis@0.12.1', function(done){
      var log = think.log;
      think.log = function(){};
      var exec = require('child_process').exec;
      var trequire = think.require;
      var flag = false;
      think.require = function(){
        if(flag){
          return {
            RedisClient: function(){}
          };
        }
        throw new Error('require error 1')
      }
      require('child_process').exec = function(cmd, options, callback){
        assert.equal(cmd, 'npm install redis@0.12.1');
        flag = true;
        callback && callback();
      }

      think.rmdir(think.THINK_PATH + '/node_modules/redis').then(function(){
        return think.npm('redis@0.12.1');
      }).then(function(data){
        require('child_process').exec = exec;
        think.require = trequire;
        think.log = log;

        assert.equal(think.isFunction(data.RedisClient), true);
        done();
      })
      
    })
    it('install package redis', function(done){
      var log = think.log;
      think.log = function(){};
      var exec = require('child_process').exec;
      var trequire = think.require;
      var flag = false;
      think.require = function(){
        if(flag){
          return {
            RedisClient: function(){}
          };
        }
        throw new Error('require error 2')
      }
      require('child_process').exec = function(cmd, options, callback){
        assert.equal(cmd, 'npm install redis@0.12.1');
        flag = true;
        callback && callback();
      }

      think.rmdir(think.THINK_PATH + '/node_modules/redis').then(function(){
        return think.npm('redis');
      }).then(function(data){
        require('child_process').exec = exec;
        think.require = trequire;
        think.log = log;

        assert.equal(think.isFunction(data.RedisClient), true);
        done();
      })
      
    })
    it('install package not exist', function(done){
      var log = think.log;
      think.log = function(){};
      var exec = require('child_process').exec;
      var trequire = think.require;
      var flag = false;
      think.require = function(){
        if(flag){
          return {
            RedisClient: function(){}
          };
        }
        throw new Error('require error 3')
      }
      require('child_process').exec = function(cmd, options, callback){
        assert.equal(cmd, 'npm install package_not_exist');
        flag = true;
        callback && callback(new Error('not exist'));
      }
      return think.npm('package_not_exist').catch(function(err){
        require('child_process').exec = exec;
        think.require = trequire;
        think.log = log;

        assert.equal(err.message, 'not exist');
        done();
      })
      
    })


  })

  describe('think.validate', function(){
    it('get validate', function(){
      var email = think.validate('email');
      assert.equal(think.isFunction(email), true);
      assert.equal(email('welefen@gmail.com'), true);
    })
    it('register validate', function(){
      think.validate('welefen', function(value){
        return value === 'welefen';
      })
      var welefen = think.validate('welefen');
      assert.equal(welefen('welefen'), true);
    })
    it('validate array', function(){
      var data = [{
        name: 'welefen',
        value: 'welefen',
        type: 'email',
        msg: 'email not valid'
      }]
      var msg = think.validate(data);
      assert.deepEqual(msg, { welefen: 'email not valid' })
    })
    it('validate array, type not set', function(){
      var data = [{
        name: 'welefen',
        value: 'welefen',
        msg: 'email not valid'
      }]
      var msg = think.validate(data);
      assert.deepEqual(msg, {})
    })
    it('validate object', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: 'email',
          required: true,
          msg: 'email not valid'
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, { welefen: 'email not valid' })
    })
    it('validate object, required', function(){
      var data = {
        welefen: {
          value: '',
          type: 'email',
          required: true,
          msg: 'email not valid',
          required_msg: 'welefen can not be blank'
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, { welefen: 'welefen can not be blank' })
    })
    it('validate object, required', function(){
      var data = {
        welefen: {
          value: '',
          type: 'email',
          required: true,
          msg: 'email not valid',
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg.welefen.length > 0, true);
    })
    it('validate object, not required', function(){
      var data = {
        welefen: {
          value: '',
          type: 'email',
          msg: 'email not valid',
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {});
    })
    it('validate object, regexp, valid', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: /welefen/g,
          msg: 'not valid',
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {});
    })
    it('validate object, regexp, not valid', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: /welefens/g,
          msg: 'not valid',
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {welefen: 'not valid'});
    })
    it('validate object, function', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: function(value){
            return value === 'welefen';
          },
          msg: 'not valid',
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {});
    })
    it('validate object, type not function', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: [],
          msg: 'not valid',
        }
      }
      try{
        var msg = think.validate(data);
        assert.equal(1, 2)
      }catch(e){
        
      }
      
    })
    it('validate object, function, args', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: function(value, val){
            return val === 'suredy';
          },
          msg: 'not valid',
          args: 'suredy'
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {});
    })
    it('validate object, function, args', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: function(value, val){
            return val === 'suredy';
          },
          msg: 'not valid',
          args: ['suredy']
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg, {});
    })

    it('validate object, no msg', function(){
      var data = {
        welefen: {
          value: 'welefen',
          type: function(value){
            return value === 'fadfasdf';
          }
        }
      }
      var msg = think.validate(data);
      assert.deepEqual(msg.welefen.length > 0, true);
    })
  })

  describe('think.cache', function(){
    it('get cache not exist', function(done){
      think.config('gc.on', false);
      think.cache('not_exist_xx').then(function(data){
        assert.equal(data, undefined);
        done();
      })
    })
    it('get cache exist', function(done){
      think.config('gc.on', false);
      think.cache('fadfasdfasd', 'welefen').then(function(){
        return think.cache('fadfasdfasd');
      }).then(function(data){
        assert.equal(data, 'welefen');
        return think.cache('fadfasdfasd', null)
      }).then(function(){
        done();
      })
    })
    it('waiting for function', function(done){
      think.config('gc.on', false);
      think.cache('faswwwwwdddf', function(){
        return 'data__'
      }).then(function(data){
        assert.equal(data, 'data__');
      }).then(function(){
        return think.cache('faswwwwwdddf')
      }).then(function(data){
        assert.equal(data, 'data__');
        return think.cache('faswwwwwdddf', null);
      }).then(function(){
        return think.cache('faswwwwwdddf')
      }).then(function(data){
        assert.equal(data, undefined);
        done();
      })
    })
    it('waiting for function, exist', function(done){
      think.config('gc.on', false);
      think.cache('welefen++++', 'welefen').then(function(){
        return think.cache('welefen++++', function(){
          assert.equal(1, 2)
          return 'suredy';
        }).then(function(data){
          assert.equal(data, 'welefen');
          return think.cache('welefen++++', null)
        }).then(function(){
          done();
        })
      })
    })
    it('waiting for function, exist', function(done){
      think.config('gc.on', false);
      think.cache('welefen++++', 'welefen', {}).then(function(){
        return think.cache('welefen++++', function(){
          assert.equal(1, 2)
          return 'suredy';
        }).then(function(data){
          assert.equal(data, 'welefen');
          return think.cache('welefen++++', null)
        }).then(function(){
          done();
        })
      })
    })
  })

  describe('think.service', function(){
    it('get sub service', function(){
      var cls = think.service({});
      assert.equal(think.isFunction(cls), true)
    })
    it('get sub service', function(){
      var cls = think.service({
        getName: function(){
          return 'welefen'
        }
      });
      assert.equal(think.isFunction(cls), true);
      var instance = new cls();
      assert.equal(instance.getName(), 'welefen')
    })
    it('get service instance', function(){
      var service = think.service('test', {}, 'common');
      assert.deepEqual(service, { http: {} });
    })
    it('get service object', function(){
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/service/test', {
        welefen: function(){
          return 'welefen'
        }
      });
      var service = think.service('home/service/test', {}, 'common');
      assert.deepEqual(service.welefen(), 'welefen');
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/service/test', null);
    })
  })

  describe('think.model', function(){
    it('get sub model', function(){
      var cls = think.model({});
      assert.equal(think.isFunction(cls), true);;
    })
    it('get sub model', function(){
      var cls = think.model({
        getName: function(){
          return 'welefen'
        }
      });
      assert.equal(think.isFunction(cls), true);
      var instance = new cls();
      assert.equal(instance.getName(), 'welefen')
    })
    it('get sub model', function(){
      var cls = think.model({
        getName: function(){
          return 'welefen'
        }
      }, {});
      assert.equal(think.isFunction(cls), true);
      var instance = new cls();
      assert.equal(instance.getName(), 'welefen')
    })
    it('get model instance', function(){
      var instance = think.model('test', {
        host: '127.0.0.1',
        type: 'mysql'
      })
      assert.equal(instance.tablePrefix, 'think_');
    })
    it('get model instance', function(){
      var instance = think.model('test', {
        host: '127.0.0.1',
        type: 'mongo'
      })
      assert.equal(instance.tablePrefix, 'think_');
    })
  })

  describe('think.controller', function(){
    it('get sub controller', function(){
      var instance = think.controller({}, {}, 'common');
      assert.equal(think.isFunction(instance), true)
    })
    it('get sub controller', function(done){
      var cls = think.controller({
        getName: function(){
          return 'welefen'
        }
      });
      getHttp().then(function(http){
        var instance = new cls(http);
        assert.equal(instance.getName(), 'welefen');
        done();
      })
    })
    it('get controller instance', function(done){
      getHttp().then(function(http){
        var controller = think.controller('test', http);
        assert.deepEqual(think.isFunction(controller.view), true);
        done();
      })
      
    })
    it('get controller object', function(done){
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/controller/test', think.controller({
        welefen: function(){
          return 'welefen'
        }
      }));
      getHttp().then(function(http){
        var controller = think.controller('home/controller/test', http);
        assert.deepEqual(controller.welefen(), 'welefen');
        thinkCache(thinkCache.ALIAS_EXPORT, 'home/controller/test', null);
        done();
      })
    })
  })

  describe('think.logic', function(){
    it('get sub logic', function(){
      var instance = think.logic({}, {}, 'common');
      assert.equal(think.isFunction(instance), true)
    })
    it('get sub logic', function(done){
      var cls = think.logic({
        getName: function(){
          return 'welefen'
        }
      });
      getHttp().then(function(http){
        var instance = new cls(http);
        assert.equal(instance.getName(), 'welefen');
        done();
      })
    })
    it('get logic instance', function(done){
      getHttp().then(function(http){
        var logic = think.logic('test', http);
        assert.deepEqual(think.isFunction(logic.view), true);
        done();
      })
      
    })
    it('get logic object', function(done){
      thinkCache(thinkCache.ALIAS_EXPORT, 'home/logic/test', think.logic({
        welefen: function(){
          return 'welefen'
        }
      }));
      getHttp().then(function(http){
        var logic = think.logic('home/logic/test', http);
        assert.deepEqual(logic.welefen(), 'welefen');
        thinkCache(thinkCache.ALIAS_EXPORT, 'home/logic/test', null);
        done();
      })
    })
  })

  describe('think.session', function(){
    it('get session, exist', function(done){
      getHttp().then(function(http){
        http.session = 'welefen';
        var session = think.session(http);
        assert.equal(session, 'welefen')
        done();
      })
    })
    it('get session', function(done){
      getHttp().then(function(http){
        var session = think.session(http);
        assert.equal(http._cookie.thinkjs.length, 32);
        done();
      })
    })
    it('get session, options, sign error', function(done){
      getHttp().then(function(http){
        var options = think.config('session');
        think.config('session', {
          name: 'test',
          sign: 'welefen'
        })
        http._cookie.test = 'test';
        var session = think.session(http);
        assert.equal(http._cookie.test.length, 32);
        done();
      })
    })
    it('get session, options, sign success', function(done){
      getHttp().then(function(http){
        var options = think.config('session');
        think.config('session', {
          name: 'test',
          sign: 'welefen'
        })

        http._cookie.test = 'g1kzmNA_xtDQKSBP2Q4M1irhPrECxGiZ.yeZHK5ympKa2jZIqRyvHCYJGPhPXemEtQF0ZU8V1Yhg';
        var session = think.session(http);
        assert.equal(http._cookie.test, 'g1kzmNA_xtDQKSBP2Q4M1irhPrECxGiZ');
        done();
      })
    })
    it('get session, options, debug', function(done){
      getHttp().then(function(http){
        var options = think.config('session');
        think.config('session', {
          name: 'test',
          sign: 'welefen'
        })

        http._cookie.test = 'g1kzmNA_xtDQKSBP2Q4M1irhPrECxGiZ.yeZHK5ympKa2jZIqRyvHCYJGPhPXemEtQF0ZU8V1Yhg';
        think.debug = true;
        var log = think.log;
        think.log = function(){}
        var session = think.session(http);
        assert.equal(http._cookie.test, 'g1kzmNA_xtDQKSBP2Q4M1irhPrECxGiZ');
        think.debug = false;
        think.log = log;
        done();
      })
    })
    it('get session, options, flush', function(done){
      getHttp().then(function(http){
        var options = think.config('session');
        think.config('session', {
          name: 'test',
          sign: 'welefen'
        })
        var value = '111';
        var session = think.session(http);
        session.flush = function(){
          value = '222';
        }
        http.emit('afterEnd');
        setTimeout(function(){
          assert.equal(value, '222')
          done();
        }, 10)
      })
    })
  })
  
  describe('think.error', function(){
    it('not error', function(){
      var msg = think.error('welefen');
      assert.equal(think.isError(msg), true);
      assert.equal(msg.message, 'welefen')
    })
    it('error contain', function(){
      var msg = think.error(new Error('EACCES'));
      assert.equal(think.isError(msg), true);
      assert.equal(msg.message, 'Permission denied. http://www.thinkjs.org/doc/error.html#EACCES')
    })
    it('error contain, addon', function(){
      var msg = think.error(new Error('EACCES'), 'haha');
      assert.equal(think.isError(msg), true);
      assert.equal(msg.message, 'Permission denied, haha. http://www.thinkjs.org/doc/error.html#EACCES')
    })
    it('error, not contain', function(){
      var msg = think.error(new Error('suredy'));
      assert.equal(think.isError(msg), true);
      assert.equal(msg.message, 'suredy')
    })
  })

})
















