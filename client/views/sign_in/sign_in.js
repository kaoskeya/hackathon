
/*****************************************************************************/
/* SignIn: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.SignIn.events(AccountsEntry.entrySignInEvents);

Template.SignIn.helpers(AccountsEntry.entrySignInHelpers);

/*****************************************************************************/
/* SignIn: Lifecycle Hooks */
/*****************************************************************************/
Template.SignIn.created = function () {
};

Template.SignIn.rendered = function () {
  var self = this

  ripples.initInputs()
  if(self.data.am){
    self.data.am.enable_read_mode()
  }


};

Template.SignIn.destroyed = function () {
};


