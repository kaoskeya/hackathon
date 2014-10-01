
/*****************************************************************************/
/* MapView: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.MapView.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */
  'click li.control' : function(e, tmpl){
    var content_view = e.target.getAttribute('data-content-view')
    var target = e.target
    if(!content_view){
      content_view = e.target.parentNode.getAttribute('data-content-view')
      target = e.target.parentNode
    }
    $(".control").removeClass('active')
    $(target).toggleClass('active')

    var current_content_view = tmpl.state.get('content_view')
    if(current_content_view == content_view){      
      tmpl.state.set('content_view', '')
      $(target).removeClass('active')
    }
    else{
      tmpl.state.set('content_view', content_view) 
    }
  },

  'click p.entry-signin-cta a' : function(e, tmpl){
    tmpl.state.set('content_view', 'SignIn')
  },

  'click p.entry-signup-cta a' : function(e, tmpl){
    tmpl.state.set('content_view', 'SignUp')
  },

  'click p.entry-forgot-cta a' : function(e, tmpl){
    tmpl.state.set('content_view', 'ForgotPassword')
  },


});

Template.MapView.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
  content_view : function(){
    var inst = UI._templateInstance()
    var view =  inst.state.get('content_view')
    if(!view && !Meteor.userId()){
      view = "SignUp"
    }

    // else if(!view && Meteor.userId()){
    //   $('#content_pane').toggleClass("hide")
    // }

    // else {
    //   $('#content_pane').toggleClass("hide")
    // }

    return view
  },

  data_helper : function(){
    var inst = UI._templateInstance()
    return {
      state : inst.state,
      am : inst.am
    }
  }


});

/*****************************************************************************/
/* MapView: Lifecycle Hooks */
/*****************************************************************************/
Template.MapView.created = function () {

  var self = this;
  self.state = new ReactiveDict()

  Deps.autorun(function(){
    if(Meteor.userId()){
      self.state.set("content_view", "Feed")
    }
    else{
      self.state.set("content_view", "SignUp")
    }
  });


};

Template.MapView.rendered = function () {

  var self = this;


  Meteor.setTimeout(function(){




    // // var circle_options = {
    // //   strokeColor: '#00FF00',
    // //   strokeOpacity: 0.8,
    // //   strokeWeight: 2,
    // //   fillColor: '#00FF00',
    // //   fillOpacity: 0.1,
    // //   map: map,
    // //   center: default_coords,
    // //   radius: 5000,
    // //   editable : true
    // // };
    // // // Add the circle for this city to the map.
    // // var circle = new google.maps.Circle(circle_options);

    // map._el = null;
    // map._tmp_marker = null

    // Deps.autorun(function(){
    //   var state = self.state.get("content_view")
    //   var current_map = map

    //   if(state == "CreateActivity"){

    //     $.snackbar({content: 'Add a new Activity by placing a marker on the map and filling out the form.'});

    //     current_map = null

    //     _.each(_.values(markers), function(marker){
    //       marker.setMap(current_map)
    //     })


    //     map._el = google.maps.event.addListener(map, 'click', function(event) {
    //       console.log(arguments)
    //       if(!map._tmp_marker){
    //         map._tmp_marker = new google.maps.Marker({
    //             position: event.latLng, 
    //             map: map
    //         });
    //       }
    //       else{
    //         map._tmp_marker.setPosition(event.latLng)
    //       }
    //       self.state.set("tmp_marker", event.latLng)

    //     });


    //   }
    //   else{
    //     if(map._el){
    //       google.maps.event.removeListener(map._el);
    //       map._el = null
    //       map._tmp_marker.setMap(null)
    //     }
    //     _.each(_.values(markers), function(marker){
    //       marker.setMap(current_map)
    //     })
    //   }
    // })

    self.am = new ActivityMap("map_view")
    self.am.add_control("map_control")

    Deps.autorun(function () {
      // Meteor.subscribe("activities", self.am.state.get("current_city"))
      Meteor.subscribe("activities")

    });

    Deps.autorun(function(){

      var cur = Activities.find()

      cur.observe({
        added: function (doc) {
          // ...
          self.am.add_marker(doc._id, doc.location.coordinates[0],
                             doc.location.coordinates[1])

        }, // Use either added() OR(!) addedAt()
        changed: function (newdoc, olddoc) {
          // ...
          self.am.remove_marker(olddoc._id, olddoc.location.coordinates[0],
                                olddoc.location.coordinates[1])

          self.am.add_marker(newdoc._id, newdoc.location.coordinates[0],
                             newdoc.location.coordinates[1])
        }, // Use either changed() OR(!) changedAt()
        removed: function (doc) {
          // ...
          self.am.remove_marker(doc._id, doc.location.coordinates[0],
                                doc.location.coordinates[1])
        }, // Use either removed() OR(!) removedAt()

      });

    })



    // Deps.autorun(function(){

    //   var view = self.state.get("content_view")
    //   if(view == "CreateActivity"){
    //     self.am.enable_write_mode()
    //   }
    //   else{
    //     self.am.enable_read_mode()
    //   }

    // });

    // self.am.get_user_location(function(){
    //   self.state.set('')
    // })


    Meteor.setTimeout(function(){
      var controlDiv = document.getElementById('map_control');
      $(controlDiv).removeClass('hide')

    }, 1000)



  }, 100)



};

Template.MapView.destroyed = function () {
};


