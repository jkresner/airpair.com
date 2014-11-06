export function checkForBot(req) {
    var botPattern = /googlebot|gurujibot|twitterbot|yandexbot|slurp|msnbot|bingbot|facebookexternalhit/i
    var source = req.header('user-agent').replace(/^\s*/, '').replace(/\s*$/, '')
    var isBot = (botPattern.test(source)) ? 'true' : 'false'
}
