angular.module('resources.groups', ['mongolabResource']);
angular.module('resources.groups').factory('Groups', ['mongolabResource', function ($mongolabResource) {

  var Groups = $mongolabResource('groups');

  Groups.forUser = function(userId, successcb, errorcb) {
    //TODO: get projects for this user only (!)
    return Groups.query({}, successcb, errorcb);
  };

  Groups.prototype.isGroupOwner = function (userId) {
    return this.GroupOwner === userId;
  };
  Projects.prototype.canActAsGroupOwner = function (userId) {
    return 1;
  };
  Projects.prototype.isGroupMember = function (userId) {
    return this.groupMembers.indexOf(userId) >= 0;
  };
  Projects.prototype.canActAsGroupMember = function (userId) {
    return 1;
  };

  return Groups;
}]);
