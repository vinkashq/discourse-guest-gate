import { cleanDOM } from 'discourse/lib/clean-dom';
import { startPageTracking } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';
import showGate from 'discourse/plugins/guest-gate/discourse/lib/show-gate';
var botPattern = "(googlebot\/|Googlebot-Mobile|Googlebot-Image|Google favicon|Mediapartners-Google|bingbot|slurp|java|wget|curl|Commons-HttpClient|Python-urllib|libwww|httpunit|nutch|phpcrawl|msnbot|jyxobot|FAST-WebCrawler|FAST Enterprise Crawler|biglotron|teoma|convera|seekbot|gigablast|exabot|ngbot|ia_archiver|GingerCrawler|webmon |httrack|webcrawler|grub.org|UsineNouvelleCrawler|antibot|netresearchserver|speedy|fluffy|bibnum.bnf|findlink|msrbot|panscient|yacybot|AISearchBot|IOI|ips-agent|tagoobot|MJ12bot|dotbot|woriobot|yanga|buzzbot|mlbot|yandexbot|purebot|Linguee Bot|Voyager|CyberPatrol|voilabot|baiduspider|citeseerxbot|spbot|twengabot|postrank|turnitinbot|scribdbot|page2rss|sitebot|linkdex|Adidxbot|blekkobot|ezooms|dotbot|Mail.RU_Bot|discobot|heritrix|findthatfile|europarchive.org|NerdByNature.Bot|sistrix crawler|ahrefsbot|Aboundex|domaincrawler|wbsearchbot|summify|ccbot|edisterbot|seznambot|ec2linkfinder|gslfbot|aihitbot|intelium_bot|facebookexternalhit|yeti|RetrevoPageAnalyzer|lb-spider|sogou|lssbot|careerbot|wotbox|wocbot|ichiro|DuckDuckBot|lssrocketcrawler|drupact|webcompanycrawler|acoonbot|openindexspider|gnam gnam spider|web-archive-net.com.bot|backlinkcrawler|coccoc|integromedb|content crawler spider|toplistbot|seokicks-robot|it2media-domain-crawler|ip-web-crawler.com|siteexplorer.info|elisabot|proximic|changedetection|blexbot|arabot|WeSEE:Search|niki-bot|CrystalSemanticsBot|rogerbot|360Spider|psbot|InterfaxScanBot|Lipperhey SEO Service|CC Metadata Scaper|g00g1e.net|GrapeshotCrawler|urlappendbot|brainobot|fr-crawler|binlar|SimpleCrawler|Livelapbot|Twitterbot|cXensebot|smtbot|bnf.fr_bot|A6-Indexer|ADmantX|Facebot|Twitterbot|OrangeBot|memorybot|AdvBot|MegaIndex|SemanticScholarBot|ltx71|nerdybot|xovibot|BUbiNG|Qwantify|archive.org_bot|Applebot|TweetmemeBot|crawler4j|findxbot|SemrushBot|yoozBot|lipperhey|y!j-asr|Domain Re-Animator Bot|AddThis)";

export default {
  name: "guest-gate",
  after: 'inject-objects',

  initialize(container) {
    if(Discourse.SiteSettings.guest_gate_enabled) {
      if (!Discourse.User.current()) {
        var pageView = 0;
        // Tell our AJAX system to track a page transition
        const router = container.lookup('router:main');
        router.on('willTransition', viewTrackingRequired);
        router.on('didTransition', cleanDOM);

        let appEvents = container.lookup('app-events:main');
        startPageTracking(router, appEvents);
        var gateShownOnce = false;

        appEvents.on('page:changed', data => {
          
          var urlPrefix = "/t/";

          var pattern = new RegExp('^' + urlPrefix);
          var hasPrefix = pattern.test(data.url);
          if(hasPrefix) {
            var isBot = false;
            var re = new RegExp(botPattern, 'i');
            if (re.test(navigator.userAgent)) {
              isBot = true;
            }
            var maxViews = parseInt(Discourse.SiteSettings.max_guest_topic_views);
            pageView++;
            var hitMaxViews = pageView >= maxViews;
            var showGateBool = hitMaxViews && !isBot && !gateShownOnce;
            if (showGateBool) {
              if (Discourse.SiteSettings.gate_show_only_once) {
                gateShownOnce = true;
              }
              pageView = getRandomInt(0, maxViews + 1);
              showGate('guest-gate');
            }
          }
        });
      }
    }
  }
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}
