import { cleanDOM } from 'discourse/lib/clean-dom';
import { startPageTracking, onPageChange } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';
import showGate from 'discourse/plugins/guest-gate/discourse/lib/show-gate';

export default {
  name: "guest-gate",

  initialize(container) {
    if(Discourse.SiteSettings.guest_gate_enabled) {
      if (!Discourse.User.current()) {
        var pageView = 0;
        // Tell our AJAX system to track a page transition
        const router = container.lookup('router:main');
        router.on('willTransition', viewTrackingRequired);
        router.on('didTransition', cleanDOM);

        startPageTracking(router);

        onPageChange((url, title) => {
          var urlPrefix = "/t/";

          var pattern = new RegExp('^' + urlPrefix);
          var hasPrefix = pattern.test(url);
          if(hasPrefix) {
            var maxViews = parseInt(Discourse.SiteSettings.max_guest_topic_views);
            pageView++;
            if (pageView === maxViews) {
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
