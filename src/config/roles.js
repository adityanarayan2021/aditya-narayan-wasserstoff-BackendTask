const allRoles = {
  user: ['user'],
  admin: ['getUsers', 'manageUsers', 'user'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
