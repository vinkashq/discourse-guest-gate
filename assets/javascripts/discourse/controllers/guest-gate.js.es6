import ModalFunctionality from 'discourse/mixins/modal-functionality';

export default Ember.Controller.extend(ModalFunctionality, {
  login: Ember.inject.controller(),

  ssoEnabled: function() {
    return this.get('siteSettings.sso_enabled');
  }.property(),

  actions: {
    externalLogin(provider) {
      this.get('login').send('externalLogin', provider);
    }
  }

});