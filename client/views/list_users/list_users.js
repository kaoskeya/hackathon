
/*****************************************************************************/
/* ListUsers: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.ListUsers.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
   "submit #invite" : function(e, tmpl){

    e.preventDefault()
    e.stopPropagation()

    var serialized = $(e.target).serializeArray()

    var email = serialized[0]['value']
    var name = serialized[1]['value']

    Meteor.call('/app/users/invite', email, name, function (error, result) {
      $(e.target).trigger('reset')
    });

   }
});

Template.ListUsers.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
});

/*****************************************************************************/
/* ListUsers: Lifecycle Hooks */
/*****************************************************************************/
Template.ListUsers.created = function () {
};

Template.ListUsers.rendered = function () {

  var self = this
  var am = self.data.am
  am.enable_read_mode()


};

Template.ListUsers.destroyed = function () {
};


