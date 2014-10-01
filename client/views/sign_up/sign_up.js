
/*****************************************************************************/
/* SignUp: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.SignUp.events(AccountsEntry.entrySignUpEvents);
Template.SignUp.events({

});

Template.SignUp.helpers(AccountsEntry.entrySignUpHelpers);
Template.SignUp.helpers({

});

/*****************************************************************************/
/* SignUp: Lifecycle Hooks */
/*****************************************************************************/
Template.SignUp.created = function () {
};

Template.SignUp.rendered = function () {
  var self = this

  ripples.initInputs()
  if(self.data.am){
    self.data.am.enable_read_mode()
  }


};

Template.SignUp.destroyed = function () {
};


