angular.module('admin-groups', [
  'resources.groups',
  'resources.users',
  'services.crud',
  'security.authorization'
])

.config(['crudRouteProvider', 'securityAuthorizationProvider', function (crudRouteProvider, securityAuthorizationProvider) {

  var getAllUsers = ['groups', 'Users', '$route', function(groups, Users, $route){
    return Users.all();
  }];

  crudRouteProvider.routesFor('groups', 'admin')
    .whenList({
      groups: ['groups', function(groups) { return groups.all(); }],
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenNew({
      group: ['groups', function(groups) { return new groups(); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    })
    .whenEdit({
      group: ['groups', 'Users', '$route', function(groups, Users, $route) { return groups.getById($route.current.params.itemId); }],
      users: getAllUsers,
      adminUser: securityAuthorizationProvider.requireAdminUser
    });
}])

.controller('groupsListCtrl', ['$scope', 'crudListMethods', 'groups', function($scope, crudListMethods, groups) {
  $scope.groups = groups;

  angular.extend($scope, crudListMethods('/admin/groups'));
}])

.controller('groupsEditCtrl', ['$scope', '$location', 'i18nNotifications', 'users', 'group', function($scope, $location, i18nNotifications, users, group) {

  $scope.group = group;
  $scope.users = users;

  $scope.onSave = function(group) {
    i18nNotifications.pushForNextRoute('crud.group.save.success', 'success', {id : group.$id()});
    $location.path('/admin/groups');
  };

  $scope.onError = function() {
    i18nNotifications.pushForCurrentRoute('crud.group.save.error', 'error');
  };

}])

.controller('GroupMembersController', ['$scope', function($scope) {
  $scope.group.teamMembers = $scope.group.teamMembers || [];

  //prepare users lookup, just keep references for easier lookup
  $scope.usersLookup = {};
  angular.forEach($scope.users, function(value, key) {
    $scope.usersLookup[value.$id()] = value;
  });

  $scope.groupAdminCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.group.canActAsGroupAdmin(user.$id());
    });
  };

  $scope.groupMemberCandidates = function() {
    return $scope.users.filter(function(user) {
      return $scope.usersLookup[user.$id()] && $scope.group.canActAsGroupMember(user.$id()) && !$scope.group.isGroupMember(user.$id());
    });
  };

  $scope.selGroupMember = undefined;

  $scope.addGroupMember = function() {
    if($scope.selGroupMember) {
      $scope.group.members.push($scope.selGroupMember);
      $scope.selGroupMember = undefined;
    }
  };

  $scope.removeGroupMember = function(teamMember) {
    var idx = $scope.group.groupMembers.indexOf(groupMember);
    if(idx >= 0) {
      $scope.group.groupMembers.splice(idx, 1);
    }
    // If we have removed the group member that is currently selected then clear this object
    if($scope.selGroupMember === groupMember) {
      $scope.selGroupMember = undefined;
    }
  };
}]);
