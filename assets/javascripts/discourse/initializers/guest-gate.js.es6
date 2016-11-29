import { cleanDOM } from 'discourse/lib/clean-dom';
import { startPageTracking, onPageChange } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';
import showModal from 'discourse/lib/show-modal';

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
          if (pageView >= Discourse.SiteSettings.allowed_guest_page_views) {
            showModal('guest-gate');
          }
          pageView++;
        });
      }
    }
  }
};
