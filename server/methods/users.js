/*****************************************************************************/
/* Users Methods */
/*****************************************************************************/

Meteor.methods({
 /*
  * Example:
  *  '/app/users/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/users/invite' : function(email, name){

    var userId = Accounts.createUser({email : email, profile : {name: name}})
    if(userId){
      Accounts.sendEnrollmentEmail(userId)
    }

  },

});
