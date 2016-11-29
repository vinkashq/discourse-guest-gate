import { on } from "ember-addons/ember-computed-decorators";
import DiscourseModal from "discourse/components/d-modal";

export default DiscourseModal.extend({
  classNameBindings: [':gate'],

  'data-keyboard': 'true',

  @on("didInsertElement")
  setUp() {
    return true;
  },

  @on("willDestroyElement")
  cleanUp() {
    return true;
  },

  click(e) {
    return true;
  }

});