angular.module("AirPair.Util.Window", [])

.factory('WINDOW', function apWindow($rootScope, MD) {

    // console.log('Prism.highlightElement', element, config);
    // function addBlockGutter() {
    //   if (!$rootScope.session._id) {
    //     element.parentNode.className = "signup " + element.parentNode.className
    //     element.parentNode.innerHTML = element.parentNode.innerHTML + `
    //     <span class="cta">
    //       <div></div><a href="/auth/github/callback?returnTo=${window.location.pathname}" target="_self">Signin with GitHub</a>
    //       <p>To see full unobfuscated code samples</p>
    //     </span>`
    //   }
    // }

  return {

    storage(k, v) {
      if (window.localStorage && typeof v != 'undefined') {
        localStorage[k] = v
        return v
      }
    },

    codeblocks: {
      highlight(opts) {
        opts = opts || {}
        var elements = document.querySelectorAll(opts.selector || 'pre > code')
        for (var i=0, elm; elm = elements[i++];) {
          var config = MD.getCodeBlockConfig(elm)
          if (config && config.lang) {
            elm.className = 'language-'+config.lang
            if (config.linenums) elm.parentNode.className = 'line-numbers'
            Prism.highlightElement(elm, false, opts.onHighlighted || (x=>{}))
          }
        }
      }
    }

  }

})


//   this.headerMenu = function()
//   {
//     var countdown = 3000
//     var timer =  null
//     $('body > header .more').mouseover(function() {
//       if (timer) {
//         window.clearTimeout(timer)
//         timer = null
//       }
//       $('body > header ul.more').show()
//     }).mouseout(function() {
//       var hide = function() {
//         $('body > header ul.more').hide()
//       }
//       timer = window.setTimeout(hide,countdown)
//     })
//   }
//   this.headerMenu()


//   this.loadDisqus = function(canonical)
//   {
//     if (window.disqus_initialized) return
//     // console.log('loadDisqus')
//     window.disqus_initialized = true
//     window.disqus_url = canonical;
//     var dsq = document.createElement('script'); dsq.type = 'text/javascript';
//     dsq.async = true;
//     dsq.src = 'https://airpairblog.disqus.com/embed.js';
//     var x = document.getElementsByTagName('script')[0];
//     x.parentNode.insertBefore(dsq, x);
//   }

//   this.loadPoSt = function()
//   {
//     if ($('#post_script').toArray().length == 0) {
//       window.pwidget_config = { shareQuote: false, afterShare: false, counter: true, copypaste: false };
//       var p = document.createElement('script');
//       p.id = 'post_script';
//       p.type = 'text/javascript';
//       p.async = true;
//       p.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
//         + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';

//       var x = document.getElementsByTagName('script')[0];
//       x.parentNode.insertBefore(p, x);
//     }
//     else
//     {
//       post_init();
//     }
//   }

//   this.fixNavs = function(elmId)
//   {
//     var scrollingOn = $(document).width() > 900;
//     var offset = 40; //$('#side').offset().top;

//     var fix = function(e){
//       if (window.scrollY < offset) {
//         $(elmId).css('top', offset - window.scrollY);
//       } else if (scrollingOn) {
//         $(elmId).css('top', 0);
//       }
//     };

//     $(window).scroll(fix);
//     fix();
//   }

//   var fixRailElements = function(e)
//   {
//     if ($('.railMarker').length == 0) return

//     var scrollingOn = $(document).width() > 900;

//     // console.log('scrollingOnr', scrollingOn, offset)
//     if (scrollingOn)
//     {
//       var offsetLeft = $('.railMarker').offset().left - 212;
//       var offset = $('.railMarker').offset().top;
//       var shareHeight = $('.share').height() + 22;
//       var cta1Height = $('.rail1CTA').height() + 16;
//       var tocH3Height = 40;

//       $('.share').css('position', 'fixed').css('left', offsetLeft);
//       $('.rail1CTA').css('position', 'fixed').css('left', offsetLeft);
//       $('#table-of-contents').css('position', 'fixed').css('left', offsetLeft);
//       $('#table-of-contents + ul').css('position', 'fixed').css('left', offsetLeft);

//       if (window.scrollY < offset)
//       {
//         $('.share').css('top', offset - window.scrollY);
//         $('.rail1CTA').css('top', offset - window.scrollY + shareHeight);
//         $('#table-of-contents').css('top', offset - window.scrollY + shareHeight + cta1Height);
//         $('#table-of-contents + ul').css('top', offset - window.scrollY + shareHeight + cta1Height + tocH3Height);
//       }
//       else {
//         var scrollSet = 10 // offset // window.scrollY - offset
//         $('.share').css('top', 0);
//         $('.rail1CTA').css('top', shareHeight);
//         $('#table-of-contents').css('top', scrollSet + shareHeight + cta1Height);
//         $('#table-of-contents + ul').css('top', scrollSet + shareHeight + cta1Height + tocH3Height);
//       }
//     }
//     else
//     {
//       $('.railBookmarkCTA').hide()
//       // if (window.scrollY < (offset + 100)) {
//         // $('.rail1CTA').css('top', offset+10 - window.scrollY);
//         // $('.rail1CTA').toggle(true)
//       // }
//       // else
//         // $('.rail1CTA').toggle(false)
//     }
//   }

//   this.fixRailElements = fixRailElements

//   function highlightSocialIcon(elem) {
//     return function() {
//       $(elem).addClass('highlight').delay(175).queue(function(){
//         $(this).removeClass('highlight')
//         $(this).dequeue()
//       })
//     }
//   }

//   var icons = null
//   var flashSocial = function() {
//     icons = icons || $('.pw-size-large .pw-icon')
//     icons.each(function(idx, elem) {
//       setTimeout(highlightSocialIcon(elem), (idx+1)*175)
//     })
//   }

//   this.fixPostRail = function()
//   {
//     if ($('.railMarker').length > 0) {
//       $(window).scroll(fixRailElements);
//       fixRailElements();
//       setTimeout(fixRailElements, 500)
//       setTimeout(fixRailElements, 1000)
//       setTimeout(fixRailElements, 3000)
//       var highlights = setInterval(flashSocial, 20000)
//     }
//   }

//   return this;
// })
