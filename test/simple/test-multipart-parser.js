require('../common');
var multipartParser = require('formidable/multipart_parser')
  , MultipartParser = multipartParser.MultipartParser
  , events = require('events')
  , Buffer = require('buffer').Buffer;

(function testConstructor() {
  var parser = new MultipartParser()
    , PROPERTIES =
      [ 'boundary'
      , 'state'
      , 'flags'
      , 'boundaryChars'
      , 'index'
      , 'lookbehind'
      ];

  assert.properties(parser, PROPERTIES);
  assert.equal(parser.constructor.name, 'MultipartParser');
})();

(function testInitWithBoundary() {
  var parser = new MultipartParser()
    , boundary = 'abc';

  parser.initWithBoundary(boundary);
  assert.deepEqual(Array.prototype.slice.call(parser.boundary), [13, 10, 45, 45, 97, 98, 99]);
  assert.equal(parser.state, multipartParser.START);

  assert.deepEqual(parser.boundaryChars, {10: true, 13: true, 45: true, 97: true, 98: true, 99: true});
})();

(function testParserError() {
  var parser = new MultipartParser()
    , boundary = 'abc'
    , buffer = new Buffer(5);

  parser.initWithBoundary(boundary);
  buffer.write('--ad', 'ascii', 0);
  assert.equal(parser.write(buffer), 3);
})();