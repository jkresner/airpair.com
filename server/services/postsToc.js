'use strict';

var htmlparser = require('htmlparser2');

function addLinenos(lines, headers) {
  var current = 0, line;

  return headers.map(function (x) {
    for (var lineno = current; lineno < lines.length; lineno++) {
      line = lines[lineno];
      if (new RegExp(x.text[0]).test(line)) {
        current = lineno;
        x.line = lineno;
        x.name = x.text.join('');
        return x
      }
    }

    // in case we didn't find a matching line, which is odd,
    // we'll have to assume it's right on the next line
    x.line = ++current;
    x.name = x.text.join('');
    return x
  })
}

function rankify(headers, max) {
  return headers
    .map(function (x) {
      x.rank = parseInt(x.tag.slice(1), 10);
      return x;
    })
    .filter(function (x) {
      return x.rank <= max;
    })
}

function getHtmlHeaders(lines, maxHeaderNo) {
  var md = lines.join('\n');
  var headers = [], grabbing = null, text = [];

  var parser = new htmlparser.Parser({
    onopentag: function (name, attr) {
      if ((/h\d/).test(name)) {
        grabbing = name;
      }
    },
    ontext: function (text_) {
      if (!grabbing) return;
      text.push(text_);
    },
    onclosetag: function (name) {
      if (!grabbing) return;
      if (grabbing === name) {
        headers.push({ text: text, tag: grabbing });
        grabbing = null;
        text = [];
      }
    }
  },
  { decodeEntities: true })

  parser.write(md);
  parser.end();

  headers = addLinenos(lines, headers)
  // consider anything past h4 to small to warrant a link, may be made configurable in the future
  headers = rankify(headers, maxHeaderNo);
  return headers;
}


////////////----------------------------------------------

// https://github.com/joyent/node/blob/192192a09e2d2e0d6bdd0934f602d2dbbf10ed06/tools/doc/html.js#L172-L183 
function getNodejsId(text, repetition) {
  text = text.replace(/[^a-z0-9]+/g, '_');
  text = text.replace(/^_+|_+$/, '');
  text = text.replace(/^([^a-z])/, '_$1');

  // If no repetition, or if the repetition is 0 then ignore. Otherwise append '_' and the number.
  // An example may be found here: http://nodejs.org/api/domain.html#domain_example_1
  if (repetition) {
    text += '_' + repetition;
  }

  return text;
}

function basicGithubId(text) {
  return text.replace(/ /g,'-')
    // escape codes
    .replace(/%([abcdef]|\d){2,2}/ig, '')
    // single chars that are removed
    .replace(/[\/?:\[\]`.,()*"';{}+<>]/g,'')
    ;
          
}

function getGithubId(text, repetition) {
  text = basicGithubId(text);

  // If no repetition, or if the repetition is 0 then ignore. Otherwise append '-' and the number.
  if (repetition) {
    text += '-' + repetition;
  }

  return text;
}

/**
 * Generates an anchor for the given header and mode.
 * 
 * @name anchorMarkdownHeader
 * @function
 * @param header      {String} The header to be anchored.
 * @param mode        {String} The anchor mode ('github.com'|'nodejs.org|bitbucket.org').
 * @param repetition  {Number} The nth occurrence of this header text, starting with 0. Not required for the 0th instance.
 * @param moduleName  {String} The name of the module of the given header (required only for 'nodejs.org' mode).
 * @return            {String} The header anchor that is compatible with the given mode.
 */
function anchor(header, mode, repetition, moduleName) {
  mode = mode || 'github.com';
  var replace;

  switch(mode) {
    case 'github.com':
      replace = getGithubId;
      break;
    case 'bitbucket.org':
      replace = getBitbucketId;
      break;
    case 'nodejs.org':
      if (!moduleName) throw new Error('Need module name to generate proper anchor for ' + mode);
      replace = function (hd, repetition) {
          return getNodejsId(moduleName + '.' + hd, repetition);
      };
      break;
    default:
      throw new Error('Unknown mode: ' + mode);
  }

  var href = replace(header.trim().toLowerCase(), repetition);

  return '[' + header + '](#' + href + ')';
};


////////////----------------------------------------------


function notNull(x) { return  x !== null; }

function addAnchor(mode, header) {
  header.anchor = anchor(header.name, mode, header.instance);
  return header;
}


function getHashedHeaders (lines) {
  var inCodeBlock = false
    , lineno = 0;

  // Turn all headers into '## xxx' even if they were '## xxx ##'
  function normalize(header) {
    return header.replace(/[ #]+$/, '');
  }

  // Find headers of the form '### xxxx xxx xx [###]'
  return lines
    .map(function (x, idx) {
      return { lineno: idx, line: x }
    })
    .filter(function (x) {
      if (x.line.match(/^```/)) {
        inCodeBlock = !inCodeBlock;
      }
      return !inCodeBlock;
    })
    .map(function (x) {
      var match = /^(\#{1,8})[ ]*(.+)\r?$/.exec(x.line);

      return match 
        ? { rank :  match[1].length
          , name :  normalize(match[2])
          , line :  x.lineno
          }
        : null;
    })
    .filter(notNull)
}

function getUnderlinedHeaders (lines) {
    // Find headers of the form
    // h1       h2
    // ==       --

    return lines
      .map(function (line, index, lines_) {
        if (index === 0) return null;
        var rank;

        if (/^==+ *\r?$/.exec(line))      rank = 1;
        else if (/^--+ *\r?$/.exec(line)) rank = 2;
        else                              return null;

        return {
          rank  :  rank,
          name  :  lines_[index - 1],
          line  :  index - 1
        };
      })
      .filter(notNull)
}

function countHeaders (headers) {
  var instances = {};

  for (var i = 0; i < headers.length; i++) {
    var header = headers[i];
    var name = header.name;

    if (instances.hasOwnProperty(name)) {
      instances[name]++;
    } else {
      instances[name] = 0;
    }

    header.instance = instances[name];
  }

  return headers;
}

export default function(content, maxHeaderNo) {
  var mode = 'github.com';
  maxHeaderNo = maxHeaderNo || 4;

  // $log('transform.content', content)

  var lines = content.split('\n')

  var headers = getHashedHeaders(lines)
    .concat(getUnderlinedHeaders(lines))
    .concat(getHtmlHeaders(lines, maxHeaderNo))

  headers.sort(function (a, b) {
    return a.line - b.line;
  });

  var allHeaders    =  countHeaders(headers)
    , lowestRank    =  _(allHeaders).chain().pluck('rank').min().value()
    , linkedHeaders =  _(allHeaders).map(addAnchor.bind(null, mode));

  if (linkedHeaders.length === 0) return { transformed: false };

  var toc = '\n\n'
    + linkedHeaders
        .map(function (x) {
          var indent = _(_.range(x.rank - lowestRank))
            .reduce(function (acc, x) { return acc + '  '; }, '');

          return indent + '- ' + x.anchor;
        })
        .join('\n')
    + '\n';

  return toc;
};
