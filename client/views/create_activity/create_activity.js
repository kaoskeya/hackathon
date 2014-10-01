
/*****************************************************************************/
/* CreateActivity: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.CreateActivity.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */

  'change input[name="title"]' : function(e, tmpl){

    var title = e.target.value
    if(!title){
      title = inst.am.temp_marker.title
    }

    tmpl.data.am.temp_marker.title = title
    tmpl.data.am.set_temp_marker(tmpl.data.am.temp_marker.place)

  },

  'change #image' : function(e, tmpl){

    FS.Utility.eachFile(e, function(_file) {

      var file = new FS.File(_file);
      file.owner = Meteor.userId()
      file.activity_id = tmpl.temp_id

      Images.insert(file, function (err, fileObj) {
        tmpl.temp_fids.push(fileObj._id)
      });

    });

  },

  'submit #create_activity' : function(e, tmpl){

    e.preventDefault()
    e.stopPropagation()

    var serialized = $(e.target).serializeArray()
    var data = {}
    _.each(serialized, function(x){
      data[x['name']] = x['value'] 
    })

    var am = tmpl.data.am
    console.log(am.temp_marker.place)
    var city = am.get_city(am.temp_marker.place)

    console.log(city)

    data['location'] = {
      type : "Point",
      coordinates : [am.temp_marker.position.lng(),
                     am.temp_marker.position.lat()],
    }
    data['city'] = city
    data['images'] = tmpl.temp_fids
    data['_id'] = tmpl.temp_id

    Meteor.call('/app/activities/put', data,
      function (error, result) {
       $(e.target).trigger('reset')
    });
  }

});

Template.CreateActivity.helpers({
  /*
   * Example:
   *  items: function () {
   *    return Items.find();
   *  }
   */
  images : function(){
    var self = this
    var inst = UI._templateInstance()

    console.log(self)
    var images = Images.find({activity_id : inst.temp_id}).fetch()
    console.log(images, inst.temp_id)
    return images
  }

});

/*****************************************************************************/
/* CreateActivity: Lifecycle Hooks */
/*****************************************************************************/
Template.CreateActivity.created = function () {
  var self = this
  self.temp_id = Random.id()
  self.temp_fids = []

};

Template.CreateActivity.rendered = function () {
  var self = this;

  ripples.initInputs();

  var am = self.data.am
  am.enable_write_mode()
  var map = am.map
  var marker = am.temp_marker

  var input = document.getElementById('location');
  var autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.bindTo('bounds', map);

  google.maps.event.addListener(autocomplete, 'place_changed', function() {

    var place = autocomplete.getPlace();
    if (!place.geometry) {
      return;
    }

    am.set_temp_marker(place)

  });

  $('.datetimepicker').datetimepicker();
  $('.datetimepicker')
    .data("DateTimePicker")
    .setMinDate(new Date());

  Deps.autorun(function () {
    var temp_address = am.state.get("temp_address")
    if(temp_address){    
      input.value = temp_address
    }
  });



};

Template.CreateActivity.destroyed = function () {

};


