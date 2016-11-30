import { on } from "ember-addons/ember-computed-decorators";
import DiscourseModal from "discourse/components/d-modal";

export default DiscourseModal.extend({
  classNameBindings: [':gate'],

  click(e) {
    return true;
  }

});