
/*****************************************************************************/
/* CreateOrganization: Event Handlers and Helpersss .js*/
/*****************************************************************************/
Template.CreateOrganization.events({
  /*
   * Example:
   *  'click .selector': function (e, tmpl) {
   *
   *  }
   */

  'change #image' : function(e, tmpl){

    FS.Utility.eachFile(e, function(_file) {

      var file = new FS.File(_file);
      file.owner = Meteor.userId()
      file.organization_id = tmpl.temp_id

      Images.insert(file, function (err, fileObj) {
        tmpl.temp_fids.push(fileObj._id)
      });

    });

  },

  'submit #create_organization' : function(e, tmpl){

    e.preventDefault()
    e.stopPropagation()

    var serialized = $(e.target).serializeArray()
    var data = {}
    _.each(serialized, function(x){
      data[x['name']] = x['value'] 
    })

    data['images'] = tmpl.temp_fids
    data['_id'] = tmpl.temp_id

    Meteor.call('/app/organization/put', data,
      function (error, result) {
        if(!error){
          $.snackbar({content: 'Organization Created'});
          $.snackbar({content: 'Create a new activity'});

          tmpl.data.state.set("content_view", "CreateActivity")

        }
      }
    );
  }


});

Template.CreateOrganization.helpers({
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
    var images = Images.find({organization_id : inst.temp_id}).fetch()
    console.log(images, inst.temp_id)
    return images
  }   

});

/*****************************************************************************/
/* CreateOrganization: Lifecycle Hooks */
/*****************************************************************************/
Template.CreateOrganization.created = function () {
  var self = this
  self.temp_id = Random.id()
  self.temp_fids = []
};

Template.CreateOrganization.rendered = function () {
  ripples.initInputs()
};

Template.CreateOrganization.destroyed = function () {
};


