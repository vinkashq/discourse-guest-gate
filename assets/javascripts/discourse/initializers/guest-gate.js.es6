import { cleanDOM } from 'discourse/lib/clean-dom';
import { startPageTracking } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';
import showGate from 'discourse/plugins/guest-gate/discourse/lib/show-gate';

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

        appEvents.on('page:changed', data => {
          var urlPrefix = "/t/";

          var pattern = new RegExp('^' + urlPrefix);
          var hasPrefix = pattern.test(data.url);
          if(hasPrefix) {
            pageView++;
            if (pageView >= Discourse.SiteSettings.max_guest_topic_views) {
              showGate('guest-gate');
            }
          }
        });
      }
    }
  }
};
