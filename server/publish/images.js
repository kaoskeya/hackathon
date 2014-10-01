/*****************************************************************************/
/* Images Publish Functions
/*****************************************************************************/

Meteor.publish('images', function () {
  // you can remove this if you return a cursor
  return Images.find()
});
