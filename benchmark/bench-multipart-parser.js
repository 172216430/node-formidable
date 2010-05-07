require('../test/common');
var multipartParser = require('formidable/multipart_parser')
  , MultipartParser = multipartParser.MultipartParser
  , parser = new MultipartParser()
  , Buffer = require('buffer').Buffer
  , boundary = '----------------------------AaB03x'
  , mb = 100
  , buffer = createMultipartBuffer(boundary, mb * 1024 * 1024)
  , callbacks =
      { partBegin: -1
      , headerField: -1
      , headerValue: -1
      , partData: -1
      , end: -1
      };


parser.initWithBoundary(boundary);
parser.onHeaderField = function() {
  callbacks.headerField++;
};

parser.onHeaderValue = function() {
  callbacks.headerValue++;
};

parser.onPartBegin = function() {
  callbacks.partBegin++;
};

parser.onPartData = function(buffer, start, end) {
  callbacks.partData++;
};

parser.onEnd = function(buffer, start, end) {
  callbacks.end++;
};

var start = +new Date()
  , nparsed = parser.write(buffer)
  , duration = +new Date - start
  , mbPerSec = (mb / (duration / 1000)).toFixed(2);

p(mbPerSec+' mb/sec');

assert.equal(nparsed, buffer.length);

function createMultipartBuffer(boundary, size) {
  var head =
        '--'+boundary+'\r\n'
      + 'content-disposition: form-data; name="field1"\r\n'
      + '\r\n'
    , tail = '--'+boundary.length+'--\r\n'
    , buffer = new Buffer(size);

  buffer.write(head, 'ascii', 0);
  buffer.write(tail, 'ascii', buffer.length - tail.length);
  return buffer;
}

assert.callbacks(callbacks);