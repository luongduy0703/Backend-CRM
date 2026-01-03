// Định nghĩa quyền cho từng role dựa trên database
export const ROLE_PERMISSIONS = {
  SUPERADMIN: [
    'APPROVE_CONTRACT',
    'CREATE_CONTRACT',
    'CREATE_PRODUCT',
    'CREATE_ROLE',
    'CREATE_USER',
    'DELETE_CONTRACT',
    'DELETE_PRODUCT',
    'DELETE_ROLE',
    'DELETE_USER',
    'EDIT_CONTRACT',
    'EDIT_PRODUCT',
    'EDIT_ROLE',
    'EDIT_USER',
    'VIEW_CONTRACTS',
    'VIEW_PRODUCTS',
    'VIEW_ROLES',
    'VIEW_USERS'
  ],
  ADMIN: [
    'APPROVE_CONTRACT',
    'CREATE_CONTRACT',
    'CREATE_PRODUCT',
    'CREATE_ROLE',
    'CREATE_USER',
    'DELETE_CONTRACT',
    'EDIT_PRODUCT',
    'EDIT_ROLE',
    'EDIT_USER',
    'VIEW_CONTRACTS',
    'VIEW_PRODUCTS',
    'VIEW_ROLES',
    'VIEW_USERS'
  ],
  SALE: [
    'EDIT_CONTRACT',
    'VIEW_CONTRACTS',
    'VIEW_PRODUCTS'
  ],
  USER: [
    'VIEW_CONTRACTS',
    'VIEW_PRODUCTS'
  ]
};

// Helper function để kiểm tra quyền
export const checkPermission = (userRole, requiredPermissions) => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return false;
  }

  // Kiểm tra từng quyền một
  return requiredPermissions.every(permission => 
    ROLE_PERMISSIONS[userRole].includes(permission)
  );
};

// Helper function để lấy các module mà user có quyền truy cập
export const getAccessibleModules = (userRole) => {
  if (!userRole || !ROLE_PERMISSIONS[userRole]) {
    return [];
  }

  const permissions = ROLE_PERMISSIONS[userRole];
  const modules = new Set();

  permissions.forEach(permission => {
    if (permission.startsWith('VIEW_')) {
      modules.add(permission.replace('VIEW_', '').split('_')[0].toLowerCase());
    }
  });

  return Array.from(modules);
}; 