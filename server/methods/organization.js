/*****************************************************************************/
/* CreateOrganization Methods */
/*****************************************************************************/

Meteor.methods({
 /*
  * Example:
  *  '/app/create_organization/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/organization/put' : function(data){
    var self = this
    var owner = self.userId

    Organizations.insert({
      _id : data._id,
      name : data.name,
      content : data.details,
      images : data['images'],
      owner : owner,
      admins : [owner],
      created_at : (new moment()).unix()
    })
  }
});
