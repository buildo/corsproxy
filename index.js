var querystring = require('querystring');
var Hapi = require('hapi')
var plugin = require('corsproxy/index')
var good = require('good')
var loggerOptions = require('corsproxy/lib/logger-options')

var server = new Hapi.Server({})
var port = parseInt(process.env.CORSPROXY_PORT || process.env.PORT || 1337, 10)
var host = (process.env.CORSPROXY_HOST || 'localhost');
var proxy = server.connection({ port: port, labels: ['proxy'], host: host });

server.register(require('inert'), function () {})
server.register(require('h2o2'), function () {})

// cors plugin
server.register(plugin, {
  select: ['proxy']
}, function (error) {
  if (error) server.log('error', error)
})

// logger plugin
server.register({
  register: good,
  options: loggerOptions
}, function (error) {
  if (error) server.log('error', error)
})

// proxy route
proxy.route({
  method: '*',
  path: '/{path*}',
  handler: {
    proxy: {
      passThrough: true,
      mapUri: function (request, callback) {
        /* ORIGINAL CODE */
        // request.host = request.params.host
        // request.path = request.path.substr(request.params.host.length + 1)
        // request.headers['host'] = request.host
        // var query = request.url.search ? request.url.search : ''
        // console.log('proxy to http://' + request.host + request.path)
        // callback(null, 'http://' + request.host + request.path + query, request.headers)

        /* FIX TO ENABLE PROXYING TO "HTTPS" */
        const protocol = request.path.split('/')[1];
        const host = request.path.split('/')[3];
        const path = '/' + request.path.split('/').slice(4).join('/');

        request.host = host;
        request.path = path;

        request.headers['host'] = request.host
        var query = request.url.search ? request.url.search : ''

        console.log('proxy to ' + protocol + '//' + request.host + request.path)
        callback(null, protocol + '//' + request.host + request.path + query, request.headers)
      }
    }
  }
})

// default route
proxy.route({
  method: 'GET',
  path: '/',
  handler: {
    file: 'public/index.html'
  }
})
proxy.route({
  method: 'GET',
  path: '/favicon.ico',
  handler: {
    file: 'public/favicon.ico'
  }
})

server.start(function (error) {
  if (error) server.log('error', error)

  server.log('info', 'CORS Proxy running at: ' + server.info.uri)
})
