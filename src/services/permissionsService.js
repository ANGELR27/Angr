/**
 * Servicio de permisos granulares para colaboración
 * Soporta permisos a nivel de usuario, archivo y acción
 */
class PermissionsService {
  constructor() {
    // Roles predefinidos con sus permisos
    this.roles = {
      owner: {
        name: 'Propietario',
        permissions: [
          'read', 'write', 'delete', 'comment', 'suggest',
          'manage_users', 'manage_permissions', 'manage_session',
          'accept_suggestions', 'reject_suggestions', 'resolve_comments',
          'view_history', 'restore_version', 'export'
        ],
        color: '#f59e0b',
        icon: '👑',
      },
      editor: {
        name: 'Editor',
        permissions: [
          'read', 'write', 'delete', 'comment', 'suggest',
          'accept_suggestions', 'reject_suggestions', 'resolve_comments',
          'view_history', 'export'
        ],
        color: '#3b82f6',
        icon: '✏️',
      },
      commenter: {
        name: 'Comentarista',
        permissions: [
          'read', 'comment', 'suggest',
          'view_history', 'export'
        ],
        color: '#8b5cf6',
        icon: '💬',
      },
      viewer: {
        name: 'Visualizador',
        permissions: [
          'read', 'view_history', 'export'
        ],
        color: '#6b7280',
        icon: '👁️',
      },
    };

    // Permisos personalizados por usuario
    this.userPermissions = new Map(); // userId -> { role, customPermissions, filePermissions }
    
    // Permisos por archivo
    this.filePermissions = new Map(); // filePath -> Map(userId -> permissions[])
  }

  /**
   * Asignar rol a un usuario
   */
  assignRole(userId, role) {
    if (!this.roles[role]) {
      console.error('❌ Rol inválido:', role);
      return false;
    }

    if (!this.userPermissions.has(userId)) {
      this.userPermissions.set(userId, {
        role,
        customPermissions: [],
        filePermissions: new Map(),
      });
    } else {
      const userPerms = this.userPermissions.get(userId);
      userPerms.role = role;
    }

    console.log(`✅ Rol ${role} asignado a usuario ${userId}`);
    this.saveToStorage();
    return true;
  }

  /**
   * Obtener rol de un usuario
   */
  getUserRole(userId) {
    const userPerms = this.userPermissions.get(userId);
    return userPerms?.role || 'viewer';
  }

  /**
   * Verificar si un usuario tiene un permiso específico
   */
  hasPermission(userId, permission, filePath = null) {
    const userPerms = this.userPermissions.get(userId);
    
    if (!userPerms) {
      // Usuario sin permisos específicos, usar rol viewer por defecto
      return this.roles.viewer.permissions.includes(permission);
    }

    // 1. Verificar permisos del rol
    const rolePermissions = this.roles[userPerms.role]?.permissions || [];
    if (rolePermissions.includes(permission)) {
      return true;
    }

    // 2. Verificar permisos personalizados globales
    if (userPerms.customPermissions.includes(permission)) {
      return true;
    }

    // 3. Verificar permisos específicos del archivo
    if (filePath && userPerms.filePermissions.has(filePath)) {
      const filePerms = userPerms.filePermissions.get(filePath);
      if (filePerms.includes(permission)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Verificar múltiples permisos (requiere todos)
   */
  hasAllPermissions(userId, permissions, filePath = null) {
    return permissions.every(perm => this.hasPermission(userId, perm, filePath));
  }

  /**
   * Verificar múltiples permisos (requiere al menos uno)
   */
  hasAnyPermission(userId, permissions, filePath = null) {
    return permissions.some(perm => this.hasPermission(userId, perm, filePath));
  }

  /**
   * Agregar permiso personalizado a un usuario
   */
  grantCustomPermission(userId, permission) {
    let userPerms = this.userPermissions.get(userId);
    
    if (!userPerms) {
      userPerms = {
        role: 'viewer',
        customPermissions: [],
        filePermissions: new Map(),
      };
      this.userPermissions.set(userId, userPerms);
    }

    if (!userPerms.customPermissions.includes(permission)) {
      userPerms.customPermissions.push(permission);
      console.log(`✅ Permiso ${permission} otorgado a usuario ${userId}`);
      this.saveToStorage();
    }
  }

  /**
   * Revocar permiso personalizado de un usuario
   */
  revokeCustomPermission(userId, permission) {
    const userPerms = this.userPermissions.get(userId);
    
    if (userPerms) {
      const index = userPerms.customPermissions.indexOf(permission);
      if (index !== -1) {
        userPerms.customPermissions.splice(index, 1);
        console.log(`❌ Permiso ${permission} revocado de usuario ${userId}`);
        this.saveToStorage();
      }
    }
  }

  /**
   * Establecer permisos para un archivo específico
   */
  setFilePermissions(userId, filePath, permissions) {
    let userPerms = this.userPermissions.get(userId);
    
    if (!userPerms) {
      userPerms = {
        role: 'viewer',
        customPermissions: [],
        filePermissions: new Map(),
      };
      this.userPermissions.set(userId, userPerms);
    }

    userPerms.filePermissions.set(filePath, permissions);
    console.log(`📁 Permisos de archivo establecidos para ${userId} en ${filePath}`);
    this.saveToStorage();
  }

  /**
   * Obtener todos los permisos de un usuario
   */
  getUserPermissions(userId, filePath = null) {
    const userPerms = this.userPermissions.get(userId);
    
    if (!userPerms) {
      return {
        role: 'viewer',
        permissions: this.roles.viewer.permissions,
        customPermissions: [],
        filePermissions: [],
      };
    }

    const rolePermissions = this.roles[userPerms.role]?.permissions || [];
    const customPermissions = userPerms.customPermissions || [];
    let filePermissions = [];

    if (filePath && userPerms.filePermissions.has(filePath)) {
      filePermissions = userPerms.filePermissions.get(filePath);
    }

    // Combinar todos los permisos (sin duplicados)
    const allPermissions = [...new Set([
      ...rolePermissions,
      ...customPermissions,
      ...filePermissions,
    ])];

    return {
      role: userPerms.role,
      permissions: allPermissions,
      customPermissions,
      filePermissions,
    };
  }

  /**
   * Verificar si puede realizar una acción específica
   */
  canPerformAction(userId, action, context = {}) {
    const { filePath, targetUserId } = context;

    switch (action) {
      case 'edit_file':
        return this.hasPermission(userId, 'write', filePath);

      case 'delete_file':
        return this.hasPermission(userId, 'delete', filePath);

      case 'add_comment':
        return this.hasPermission(userId, 'comment', filePath);

      case 'create_suggestion':
        return this.hasPermission(userId, 'suggest', filePath);

      case 'accept_suggestion':
        return this.hasPermission(userId, 'accept_suggestions', filePath);

      case 'reject_suggestion':
        return this.hasPermission(userId, 'reject_suggestions', filePath);

      case 'manage_user':
        // Solo el owner puede gestionar usuarios
        return this.hasPermission(userId, 'manage_users');

      case 'change_permissions':
        // Solo el owner puede cambiar permisos de otros
        if (targetUserId === userId) return true; // Puede ver sus propios permisos
        return this.hasPermission(userId, 'manage_permissions');

      case 'restore_version':
        return this.hasPermission(userId, 'restore_version');

      case 'export_project':
        return this.hasPermission(userId, 'export');

      default:
        return false;
    }
  }

  /**
   * Obtener información de un rol
   */
  getRoleInfo(roleName) {
    return this.roles[roleName] || null;
  }

  /**
   * Obtener todos los roles disponibles
   */
  getAllRoles() {
    return Object.entries(this.roles).map(([key, role]) => ({
      id: key,
      ...role,
    }));
  }

  /**
   * Obtener resumen de permisos del usuario
   */
  getUserPermissionsSummary(userId) {
    const userPerms = this.getUserPermissions(userId);
    const roleInfo = this.getRoleInfo(userPerms.role);

    return {
      role: userPerms.role,
      roleName: roleInfo?.name || 'Desconocido',
      roleIcon: roleInfo?.icon || '❓',
      roleColor: roleInfo?.color || '#6b7280',
      totalPermissions: userPerms.permissions.length,
      canEdit: userPerms.permissions.includes('write'),
      canComment: userPerms.permissions.includes('comment'),
      canSuggest: userPerms.permissions.includes('suggest'),
      canManageUsers: userPerms.permissions.includes('manage_users'),
    };
  }

  /**
   * Sincronizar cambio de permisos desde otro usuario
   */
  syncPermissionChange(payload) {
    const { userId, role, customPermissions, action } = payload;

    switch (action) {
      case 'assign_role':
        this.assignRole(userId, role);
        break;

      case 'grant_permission':
        if (customPermissions) {
          customPermissions.forEach(perm => {
            this.grantCustomPermission(userId, perm);
          });
        }
        break;

      case 'revoke_permission':
        if (customPermissions) {
          customPermissions.forEach(perm => {
            this.revokeCustomPermission(userId, perm);
          });
        }
        break;
    }
  }

  /**
   * Guardar en localStorage
   */
  saveToStorage() {
    try {
      const data = {
        userPermissions: Array.from(this.userPermissions.entries()).map(([userId, perms]) => [
          userId,
          {
            ...perms,
            filePermissions: Array.from(perms.filePermissions.entries()),
          },
        ]),
      };
      localStorage.setItem('user_permissions', JSON.stringify(data));
    } catch (e) {
      console.error('❌ Error guardando permisos:', e);
    }
  }

  /**
   * Cargar desde localStorage
   */
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('user_permissions');
      if (stored) {
        const data = JSON.parse(stored);
        this.userPermissions = new Map(
          data.userPermissions.map(([userId, perms]) => [
            userId,
            {
              ...perms,
              filePermissions: new Map(perms.filePermissions),
            },
          ])
        );
        console.log(`🔐 Permisos de ${this.userPermissions.size} usuarios cargados`);
      }
    } catch (e) {
      console.error('❌ Error cargando permisos:', e);
    }
  }

  /**
   * Limpiar todos los permisos
   */
  clearAll() {
    this.userPermissions.clear();
    this.filePermissions.clear();
    localStorage.removeItem('user_permissions');
    console.log('🧹 Todos los permisos eliminados');
  }
}

// Exportar instancia singleton
export const permissionsService = new PermissionsService();
export default permissionsService;
