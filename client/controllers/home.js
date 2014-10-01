HomeController = RouteController.extend({
  waitOn: function () {
    return [Meteor.subscribe('images')]
  },

  data: function () {
  },

  action: function () {
    this.render();
  }
});
