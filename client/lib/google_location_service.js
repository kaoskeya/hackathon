GoogleLocationService = function(types) {
 this._autocomplete = new google.maps.places.AutocompleteService();
 this._geocoder = new google.maps.Geocoder();
 this.types = types
}

GoogleLocationService.prototype = {
 find : function(query, callback){
   this._autocomplete.getPredictions({
       input : query,
       types : this.types
     },
     function(results, status){
       if(status == google.maps.GeocoderStatus.OK){
         callback(results)
       }
     }
   )
 },

 geocode : function(address, callback){

   this._geocoder.geocode({"address": address},
     function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
         callback(results)
       }
     }
   );

 },

 geocode_first : function(address, callback){
   this.geocode(address, function(results){
     callback(results[0])
   })
 },



 reverse_geocode : function(address, callback){

   this._geocoder.geocode({"latLng": address},
     function(results, status) {
       if (status == google.maps.GeocoderStatus.OK) {
         callback(results)
       }
     }
   );

 },

 reverse_geocode_first : function(address, callback){
   this.reverse_geocode(address, function(results){
     callback(results[0])
   })
 }


}