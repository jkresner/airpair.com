angular.module("AirPair.Util.Markdown", [])

.factory('MD', function apMarkdown() {

  return {

    getCodeBlockConfig(element) {
      var config = this.parseCodeBlockConfigDeprecated(element.parentNode)
      if (!config || !config.lang)
        config = this.parseCodeBlockConfig(element)
      return config
    },

    parseCodeBlockConfig(elm) {
      var cfg = {}
      var codeClass = $(elm).attr('class')
      if (codeClass) {
        var lang = codeClass.match(/lang-\w+/i)
        if (lang) cfg.lang = lang[0].replace('lang-','')

        var linenums = (codeClass.match(/linenums=true+/i)||[])[0]
        if (linenums) cfg.linenums = true
      }
      return cfg
    },

    parseCodeBlockConfigDeprecated(elm) {
      var cfg = {}
      var prevSibling = elm.previousSibling
      var nodeValue = null
      while (prevSibling && prevSibling.nodeType!==1) {
        if (prevSibling.nodeType === 8)
          nodeValue = prevSibling.nodeValue
        prevSibling = prevSibling.previousSibling
      }

      if (nodeValue) {
        var lang = nodeValue.match(/lang=\w+/i)
        if (lang) cfg.lang = lang[0].replace('lang=','')

        var linenums = (nodeValue.match(/linenums=true+/i)||[])[0]
        if (linenums) cfg.linenums = true
      }
      return cfg
  }

}})
