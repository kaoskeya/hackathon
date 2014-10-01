Images = new FS.Collection("images", {
  stores: [new FS.Store.FileSystem("images", {})],
  filter: {
    allow: {
      contentTypes: ['image/*'] //allow only images in this FS.Collection
    }
  }
});

/*
 * Add query methods like this:
 *  Images.findPublic = function () {
 *    return Images.find({is_public: true});
 *  }
 */
