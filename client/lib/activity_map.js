ActivityMap = function(id, options, center) {
  var self = this

  var center = center || new google.maps.LatLng(12.971599, 77.594563);

  var options = options || {
    zoom: 13,
    center: center,
    disableDefaultUI: true,
    panControl: true,
    zoomControl: true,
    scaleControl: false,  // fixed to BOTTOM_RIGHT
    streetViewControl: true
  }

  self.state = new ReactiveDict()

  self.map = new google.maps.Map(document.getElementById(id), options);
  self.location_service = new GoogleLocationService(['(regions)']);

  self.markers = {};
  self.temp_marker = new google.maps.Marker({
      map: self.map,
      position : self.map.getCenter()
  });
  self.temp_marker.setVisible(false)
  self.temp_marker.infowindow = new google.maps.InfoWindow();

  self.temp_marker.title = "Yet Another Activity"


  google.maps.event.addListener(self.map, 'bounds_changed', function(){
    var bounds = self.map.getBounds();
    var center = bounds.getCenter();

    self.location_service.reverse_geocode_first(center,
      function(result){
        if(!self.temp_marker.place){
          self.temp_marker.place = result
        }
        var city = _.filter(result.address_components, function(x){
          return x.types[0] == 'administrative_area_level_1'
        })[0]
        if(city){
          self.state.set("current_city", city['long_name'])
        }
      }
    );
  })



}

ActivityMap.prototype = {

  get_user_location : function(callback){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        var coords = new google.maps.LatLng(position.coords.latitude,
          position.coords.longitude);
        callback(coords)
      });
    }
  },

  get_city : function(place){

    var city = "N/A"
    var result = _.filter(place.address_components, function(x){
      return x.types[0] == 'administrative_area_level_1'
    })[0]

    if(result)
      city = city['long_name']

    return city
  },

  add_marker : function(id, lat, lng){
    var self = this
    var position = new google.maps.LatLng(lng, lat)

    self.markers[id] = new google.maps.Marker({
        position: position,
        map: self.map
    });
  },

  remove_marker : function(id){
    var self = this
    self.markers[id].setMap(null)
    delete self.markers[id]
  },

  hide_marker : function(id){
    var self = this
    self.markers[id].setVisible(false)
  },

  show_marker : function(id){
    var self = this
    self.markers[id].setVisible(true)
  },

  hide_all_markers : function(){
    var self = this
    _.each(_.keys(self.markers), function(id){
      self.hide_marker(id)
    })
  },

  show_all_markers : function(){
    var self = this
    _.each(_.keys(self.markers), function(id){
      self.show_marker(id)
    })
  },

  enable_write_mode : function(){
    var self = this;

    self.temp_marker.fids = []

    self.hide_all_markers()

    if(!self.write_handler){

      self.write_handler = google.maps.event.addListener(self.map, 'click',
        function(event) {

          self.location_service.reverse_geocode_first(event.latLng,
            function(place){
              place.name = place.formatted_address.split(",")[0]
              self.temp_marker.place = place
              self.state.set("temp_address", place.formatted_address)
              self.set_temp_marker(place)
            }
          );
        }
      )
    }

  },


  enable_read_mode : function(){
    var self = this;

    google.maps.event.removeListener(self.write_handler);
    self.write_handler = null
    self.temp_marker.setVisible(false)
    self.temp_marker.infowindow.close()
    self.show_all_markers();

  },

  set_mode : function(mode){
    var self = this
    self['enable_' + mode + 'mode']();

  },

  add_control : function(id, control_position){

    var self = this

    var control_position = control_position || google.maps.ControlPosition.TOP_RIGHT

    var controlDiv = document.getElementById(id);
    controlDiv.index = 1;
    self.map.controls[control_position].push(controlDiv);

  },

  get_address : function(place){

    var address = '';
    if (place.address_components) {
      address = [
        (place.address_components[0] && place.address_components[0].short_name || ''),
        (place.address_components[1] && place.address_components[1].short_name || ''),
        (place.address_components[2] && place.address_components[2].short_name || '')
      ].join(' ');
    }

    return address

  },

  set_temp_marker : function(place){

    var self = this;

    var marker = self.temp_marker;

    marker.place = place;

    // marker.infowindow.close();
    marker.setVisible(false);

    self.map.setCenter(place.geometry.location);
    self.map.setZoom(17);  // Why 17? Because it looks good.

    self.center_map();

    marker.setPosition(place.geometry.location);
    marker.setVisible(true);

    var address = self.get_address(place)

    marker.infowindow.setContent(('<div><strong>' + marker.title +
        '</strong><br>' + address + '<br/><small><i>Click on the map to place marker</i></small> </div>'));
    marker.infowindow.open(self.map, marker);

  },

  center_map : function(){

    var self = this

    var b = self.map.getBounds()
    var c = b.getCenter()
    var ne = b.getNorthEast()

    var diff = ne.lng() - c.lng()

    var center = new google.maps.LatLng(c.lat(), (c.lng() + (0.33 * diff)))

    self.map.setCenter(center)
  }




}