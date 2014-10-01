
/*****************************************************************************/
/* Feed: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.Feed.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
   "click #rsvp" : function(e, tmpl){
      Meteor.call("/app/activities/rsvp", this._id, function(){

      })
   },

   "click #attendees_toggle" : function(){
      $("#attendees_container_" + this._id).toggleClass("hide")
   }

});

var attendees = new ReactiveDict()

Template.Feed.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
  feed : function(){
    return Activities.find({}, {sort : {start_time : 1}}).fetch()
  },

  is_rsvpd : function(){
    var self = this


    var userId = Meteor.userId()
    if(_.contains(self.rsvpd, userId)){
      return true
    }
    return false
  },

  attendees : function(){
    var self = this
    return attendees.get(this._id).join(", ")
  },

  attendee_count : function(){
    var self = this

    Meteor.call('/app/activities/attendees', this._id, 
      function (error, result) {

        if(!error){
          attendees.set(self._id, result)
        }
    });

    return this.rsvpd.length
  },

  is_owner : function(){
    if(this.owner == Meteor.userId()){
      return false
    }
    return true
  }

});

/*****************************************************************************/
/* Feed: Lifecycle Hooks */
/*****************************************************************************/
Template.Feed.created = function () {
  var self = this
};

Template.Feed.rendered = function () {

  var self = this

  self.attendees = new Blaze.ReactiveVar()

  var am = self.data.am
  am.enable_read_mode()

};

Template.Feed.destroyed = function () {
};


