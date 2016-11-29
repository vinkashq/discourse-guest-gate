import { cleanDOM } from 'discourse/lib/clean-dom';
import { startPageTracking, onPageChange } from 'discourse/lib/page-tracker';
import { viewTrackingRequired } from 'discourse/lib/ajax';

export default {
  name: "guest-gate",

  initialize(container) {
    if (!Discourse.User.current()) {
      var pageView = 0;
      // Tell our AJAX system to track a page transition
      const router = container.lookup('router:main');
      router.on('willTransition', viewTrackingRequired);
      router.on('didTransition', cleanDOM);

      startPageTracking(router);

      onPageChange((url, title) => {
        if (pageView >= 1) {
          // TODO: Show Guest Gate
        }
        pageView++;
      });
    }
  }
};
