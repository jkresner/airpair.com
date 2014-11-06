export function checkForBots(req) {
    var botPattern = /googlebot|gurujibot|twitterbot|yandexbot|slurp|msnbot|bingbot|facebookexternalhit/i
    var source = req.header('user-agent').replace(/^\s*/, '').replace(/\s*$/, '')
    return botPattern.test(source)
}
