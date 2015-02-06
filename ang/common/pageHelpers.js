window.storage = function(k, v) {
  if (window.localStorage)
  {
    if (typeof v == 'undefined')
    {
      return localStorage[k];
    }
    localStorage[k] = v;
    return v;
  }
}

var getHighlightConfigNew = function(elm) {
  var cfg = {};
  // console.log('getHighlightConfigNEW', elm)
  var codeClass = $(elm).attr('class')
  if (codeClass)
  {
    var lang = codeClass.match(/lang-\w+/i)
    if (lang) {
      cfg.lang = lang[0].replace('lang-','');
    }
    var linenums = (codeClass.match(/linenums=true+/i)||[])[0];
    if (linenums)
    {
      cfg.linenums = true;
    }
  }
  return cfg;
}


var getHighlightConfig = function(elm) {
  var cfg = {};
  var prevSibling = elm.previousSibling;
  var nodeValue = null;
  while (prevSibling && prevSibling.nodeType!==1) {
      if (prevSibling.nodeType === 8 || prevSibling.nodeType === 3) {
          nodeValue = prevSibling.nodeValue;
      }
      prevSibling = prevSibling.previousSibling;
  }

  if (nodeValue)
  {
    var lang = nodeValue.match(/lang=\w+/i)
    if (lang) {
      cfg.lang = lang[0].replace('lang=','');
    }
    var linenums = (nodeValue.match(/linenums=true+/i)||[])[0];
    if (linenums)
    {
      cfg.linenums = true;
    }
  }

  // console.log('getHighlightConfig', nodeValue, cfg);
  return cfg;
}

angular.module("APPageHelpers", [])

.factory('PageHlpr', function NotificationsFactory($rootScope) {

  var highlightBlock = function(element, opts) {
    var config = getHighlightConfig(element.parentNode);
      if (!config || !config.lang)
        config = getHighlightConfigNew(element);
      if (!config || !config.lang) return

      if (config.linenums)
      {
        element.parentNode.className = 'line-numbers'
      }
      // console.log('Prism.highlightElement', element, config);

      element.className = 'language-'+config.lang
      Prism.highlightElement(element, false, function() {
        if (opts && opts.addCtrs)
        {
          if ($rootScope.session._id)
            element.outerHTML+='<footer>Get expert <a class="trackPostCTA" href="/meet-experts">'+config.lang+' help</a></footer>';
          else
            element.outerHTML+='<footer>Like learning from posts like this? <a onclick="$(\'#postSubscribeEmail\').focus()"><b>Subscribe for more!</b></a></footer>';
        }
      });
  }

  this.highlightSyntax = function(opts) {
    var elements = document.querySelectorAll('pre > code')
    // console.log('Prism.highlightElement', elements);
    for (var i=0, element; element = elements[i++];) {
      highlightBlock(element, opts)
    }
  }

  this.headerMenu = function()
  {
    var countdown = 3000
    var timer =  null
    $('body > header .more').mouseover(function() {
      if (timer) {
        window.clearTimeout(timer)
        timer = null
      }
      $('body > header ul.more').show()
    }).mouseout(function() {
      var hide = function() {
        $('body > header ul.more').hide()
      }
      timer = window.setTimeout(hide,countdown)
    })
  }
  this.headerMenu()


  this.loadDisqus = function(canonical)
  {
    if (window.disqus_initialized) return
    // console.log('loadDisqus')
    window.disqus_initialized = true
    window.disqus_url = canonical;
    var dsq = document.createElement('script'); dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = 'https://airpairblog.disqus.com/embed.js';
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(dsq, x);
  }

  this.loadPoSt = function()
  {
    window.pwidget_config = { shareQuote: false, afterShare: false, counter: true };
    var p = document.createElement('script');
    p.type = 'text/javascript';
    p.async = true;
    p.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
      + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';

    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(p, x);
  }

  this.fixNavs = function(elmId)
  {
    var scrollingOn = $(document).width() > 900;
    var offset = 40; //$('#side').offset().top;

    var fix = function(e){
      if (window.scrollY < offset) {
        $(elmId).css('top', offset - window.scrollY);
      } else if (scrollingOn) {
        $(elmId).css('top', 0);
      }
    };

    $(window).scroll(fix);
    fix();
  }

  var fixRailElements = function(e)
  {
    if ($('.railMarker').length == 0) return

    var scrollingOn = $(document).width() > 900;
    var offsetLeft = $('.railMarker').offset().left - 212;
    var offset = $('.railMarker').offset().top;
    var shareHeight = $('.share').height() + 20;
    var cta1Height = $('.rail1CTA').height() + 20;
    var tocH3Height = 50;

    $('.share').css('left', offsetLeft);
    $('.rail1CTA').css('left', offsetLeft);
    $('#table-of-contents').css('left', offsetLeft);
    $('#table-of-contents + ul').css('left', offsetLeft);

    // console.log('scrollingOnr', offset)
    if (scrollingOn)
    {
      if (window.scrollY < offset)
      {
        $('.share').css('top', offset - window.scrollY);
        $('.rail1CTA').css('top', offset - window.scrollY + shareHeight);
        $('#table-of-contents').css('top', offset - window.scrollY + shareHeight + cta1Height);
        $('#table-of-contents + ul').css('top', offset - window.scrollY + shareHeight + cta1Height + tocH3Height);
      }
      else {
        var scrollSet = 10 // offset // window.scrollY - offset
        $('.share').css('top', 0);
        $('.rail1CTA').css('top', shareHeight);
        $('#table-of-contents').css('top', scrollSet + shareHeight + cta1Height);
        $('#table-of-contents + ul').css('top', scrollSet + shareHeight + cta1Height + tocH3Height);
      }
    }
    else
    {
      $('.railBookmarkCTA').hide()
      $('.share').hide()
      // if (window.scrollY < (offset + 100)) {
        // $('.rail1CTA').css('top', offset+10 - window.scrollY);
        // $('.rail1CTA').toggle(true)
      // }
      // else
        // $('.rail1CTA').toggle(false)
    }
  }

  this.fixRailElements = fixRailElements

  this.fixPostRail = function()
  {
    if ($('.railMarker').length > 0) {
      $(window).scroll(fixRailElements);
      fixRailElements();
      setTimeout(fixRailElements, 500)
      setTimeout(fixRailElements, 1000)
      setTimeout(fixRailElements, 3000)
    }
  }

  return this;
})
