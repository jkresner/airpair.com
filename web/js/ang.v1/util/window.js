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
    },

    legacy: {
      fixPostRail: function() {
        var mkr = document.getElementById('rail-marker')
        if (mkr) {
          window.scrollTo(fixRailElements, 0)
          fixRailElements();
          setTimeout(fixRailElements, 500)
          setTimeout(fixRailElements, 1000)
          setTimeout(fixRailElements, 3000)
          var highlights = setInterval(flashSocial, 20000)
        }
      },
      loadPoSt: function() {
        var post_script = document.getElementById('post_script')
        if (!post_script) {
          window.pwidget_config = { shareQuote: false, afterShare: false, counter: true, copypaste: false };
          var p = document.createElement('script');
          p.id = 'post_script';
          p.type = 'text/javascript';
          p.async = true;
          p.src = ('https:' == document.location.protocol ? 'https://s' : 'http://i')
            + '.po.st/static/v3/post-widget.js#publisherKey=miu9e01ukog3g0nk72m6&retina=true';

          var x = document.getElementsByTagName('script')[0];
          x.parentNode.insertBefore(p, x);
        }
      }
    }
  }

})


  var fixRailElements = function(e)
  {
    // if ($('.railMarker').length == 0) return
    var scrollingOn = document.body.clientWidth > 900;

    // console.log('scrollingOnr', scrollingOn, offset)
    if (scrollingOn)
    {
      // console.log('fixRailElements todo')
      // var offsetLeft = $('.railMarker').offset().left - 212;
      // var offset = $('.railMarker').offset().top;
      // var shareHeight = $('.share').height() + 22;
      // var cta1Height = $('.rail1CTA').height() + 16;
      // var tocH3Height = 40;

      // $('.share').css('position', 'fixed').css('left', offsetLeft);
      // $('.rail1CTA').css('position', 'fixed').css('left', offsetLeft);
      // $('#table-of-contents').css('position', 'fixed').css('left', offsetLeft);
      // $('#table-of-contents + ul').css('position', 'fixed').css('left', offsetLeft);

      // if (window.scrollY < offset)
      // {
      //   $('.share').css('top', offset - window.scrollY);
      //   $('.rail1CTA').css('top', offset - window.scrollY + shareHeight);
      //   $('#table-of-contents').css('top', offset - window.scrollY + shareHeight + cta1Height);
      //   $('#table-of-contents + ul').css('top', offset - window.scrollY + shareHeight + cta1Height + tocH3Height);
      // }
      // else {
      //   var scrollSet = 10 // offset // window.scrollY - offset
      //   $('.share').css('top', 0);
      //   $('.rail1CTA').css('top', shareHeight);
      //   $('#table-of-contents').css('top', scrollSet + shareHeight + cta1Height);
      //   $('#table-of-contents + ul').css('top', scrollSet + shareHeight + cta1Height + tocH3Height);
      // }
    }
    // else
    // {
      // $('.railBookmarkCTA').hide()
      // if (window.scrollY < (offset + 100)) {
        // $('.rail1CTA').css('top', offset+10 - window.scrollY);
        // $('.rail1CTA').toggle(true)
      // }
      // else
        // $('.rail1CTA').toggle(false)
    // }
  }

function highlightSocialIcon(elem) {
  // return function() {
  //   $(elem).addClass('highlight').delay(175).queue(function(){
  //     $(this).removeClass('highlight')
  //     $(this).dequeue()
  //   })
  // }
}

var icons = null
var flashSocial = function() {
  // icons = icons || $('.pw-size-large .pw-icon')
  // icons.each(function(idx, elem) {
  //   setTimeout(highlightSocialIcon(elem), (idx+1)*175)
  // })
}


