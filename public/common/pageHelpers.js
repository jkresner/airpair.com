window.pageHlpr = {}

var getHighlightConfig = function(elm) {
  var cfg = {};
  var prevSibling = elm.previousSibling;
  var nodeValue = null;
  while (prevSibling && prevSibling.nodeType!==1) {
      if (prevSibling.nodeType === 8) {
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


window.pageHlpr.highlightSyntax = function(opts) {
  var elements = document.querySelectorAll('pre > code')
  // console.log('Prism.highlightElement', elements);
  for (var i=0, element; element = elements[i++];) {
    var config = getHighlightConfig(element.parentNode);
    if (!config || !config.lang) { return }

    if (config.linenums)
    {
      element.parentNode.className = 'line-numbers'
    }
    // console.log('Prism.highlightElement', element, config);

    element.className = 'language-'+config.lang
    Prism.highlightElement(element, false, function() {
      if (opts && opts.addCtrs)
      {
        element.outerHTML+='<footer>Get expert <a class="trackPostCTA" href="/find-an-expert?utm_source=airpair.com&utm_campaign=posts-{{campPeriod}}&utm_content={{viewData.slug}}&utm_medium=website&utm_term='+config.lang+'">'+config.lang+' help</a></footer>';
      }
    });
  }
}


window.pageHlpr.loadDisqus = function(canonical)
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


window.pageHlpr.loadPoSt = function()
{
  window.pwidget_config = { shareQuote: false, afterShare: false };
  var p = document.createElement('script');
  p.type = 'text/javascript';
  p.async = true;
  p.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
    + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';

  var x = document.getElementsByTagName('script')[0];
  x.parentNode.insertBefore(p, x);
}



window.pageHlpr.fixNavs = function(elmId)
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
  var scrollingOn = $(document).width() > 900;
  var offset = $('.railCTA1Holder').offset().top;

  if (scrollingOn)
  {
    if (window.scrollY < offset) {
      $('.rail1CTA').css('top', offset - window.scrollY);
      $('.share').css('top', 0);
      $('#table-of-contents').css('top', 0);
      $('#table-of-contents + ul').css('top', 0);
    }
    else {
      $('.rail1CTA').css('top', 0);
      $('.share').css('top', window.scrollY - 170);
      $('#table-of-contents').css('top', window.scrollY - 180);
      $('#table-of-contents + ul').css('top', window.scrollY - 180);
    }
  }
  else
  {
    if (window.scrollY < (offset + 100)) {
      $('.rail1CTA').css('top', offset+10 - window.scrollY);
      $('.rail1CTA').toggle(true)
    }
    else
      $('.rail1CTA').toggle(false)
  }
}

window.pageHlpr.fixPostRail = function()
{
  if ($('.rail1CTA').length > 0) {
    $(window).scroll(fixRailElements);
    fixRailElements();
  }
}
