window.postHlpr = {};

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

  // console.log(nodeValue, cfg);
  return cfg;
}


postHlpr.highlightSyntax = function(opts) {
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
        element.outerHTML+='<footer>Get expert <a href="/find-an-expert">'+config.lang+' help</a></footer>'
      }
    });
  }
}

postHlpr.loadDisqus = function()
{
  (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'https://airpairblog.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();    
}

postHlpr.loadPoSt = function()
{
  window.pwidget_config = { shareQuote: false, afterShare: false };
  (function() {
      var src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
        + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true&init=lazy';

      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = src;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();    
}
