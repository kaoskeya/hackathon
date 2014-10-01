/*****************************************************************************/
/* Activities Publish Functions
/*****************************************************************************/

Meteor.publish('activities', function (city) {

  console.log(city)
  // you can remove this if you return a cursor
  // return Activities.find({
  //   city : city
  // })

  return Activities.find()

});
