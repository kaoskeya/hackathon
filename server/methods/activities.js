/*****************************************************************************/
/* Activities Methods */
/*****************************************************************************/

Meteor.methods({
 /*
  * Example:
  *  '/app/activities/update/email': function (email) {
  *    Users.update({_id: this.userId}, {$set: {'profile.email': email}});
  *  }
  *
  */
  '/app/activities/put' : function(data){

    var self = this
    var owner = self.userId

    var format = "dddd, MMMM Do YYYY, h:mm:ss A"

    Activities.insert({
      _id : data._id,
      images : data.images,
      city : data.city,
      location : data.location,
      content : data.details,
      start_time : (new moment(data.start_time, format)).unix(),
      end_time : (new moment(data.end_time, format)).unix(),
      title : data.title,
      owner : owner,
      rsvpd : [owner]
    })
  },

  '/app/activities/rsvp' : function(activity_id){
      var userId = this.userId
      var activity = Activities.findOne({_id : activity_id})

      if(activity.rsvpd && _.contains(activity.rsvpd, userId)){
        Activities.update({_id : activity_id}, {$pull : {rsvpd :  userId}});        
      }
      else{
        Activities.update({_id : activity_id}, {$push : {rsvpd :  userId}});
      }
  },


  '/app/activities/attendees' : function(activity_id){

    var activity = Activities.findOne({_id : activity_id})

    var users = []

    _.each(Meteor.users.find({_id : {$in : activity.rsvpd}}).fetch(),
      function(user){
        try{
          users.push(user.profile.name)
        }
        catch(er) {
          users.push("Anonymous")
        }
      })
    return users
  }

});
