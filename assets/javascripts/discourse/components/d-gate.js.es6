import { on } from "ember-addons/ember-computed-decorators";
import DiscourseModal from "discourse/components/d-modal";

export default DiscourseModal.extend({
  classNameBindings: [':gate'],
  attributeBindings: ['data-keyboard'],

  'data-keyboard': 'true',

  @on("didInsertElement")
  setUp() {
    this.appEvents.on('modal:body-shown', data => {
      if (data.title) {
        this.set('title', I18n.t(data.title));
      }
    });
  },

  click(e) {
    return true;
  }

});