export const PERMISSIONS = {
  // ==========================================
  // 1. LEADS MANAGEMENT (Sabse Important) 💼
  // ==========================================

  // Dekhne ki powers
  LEADS_VIEW_ALL: 'leads.view_all', // Admin/Manager: Sabki leads dekh sake
  LEADS_VIEW_OWN: 'leads.view_own', // Salesman: Sirf apni assigned leads dekh sake

  // Action powers
  LEADS_CREATE: 'leads.create', // Nayi lead add karna
  LEADS_EDIT: 'leads.edit', // Lead ka status/details change karna
  LEADS_DELETE: 'leads.delete', // Lead delete karna (Dangerous permission)

  // Assignment powers
  LEADS_ASSIGN: 'leads.assign', // Kisi aur ko lead assign karna (Manager power)

  // Data Import/Export (Security Risk)
  LEADS_IMPORT: 'leads.import', // Excel se bulk upload karna
  LEADS_EXPORT: 'leads.export', // Saara data download karna (Data chori rokne ke liye)

  // ==========================================
  // 2. TEAM & USER MANAGEMENT 👥
  // ==========================================

  USERS_VIEW: 'users.view', // Team list dekhna
  USERS_CREATE: 'users.create', // Naye member (Admin/Sales) ko add karna
  USERS_EDIT: 'users.edit', // Kisi ka naam/role change karna
  USERS_DELETE: 'users.delete', // Kisi ko fire karna (Remove access)

  // ==========================================
  // 3. ORGANIZATION & BILLING (Owner Stuff) 🏢
  // ==========================================

  ORG_UPDATE: 'org.update', // Company name/logo change karna
  ORG_BILLING: 'org.billing', // Plan upgrade karna, Invoice dekhna
  ORG_DELETE: 'org.delete', // Company delete karna
  ORG_VIEW: 'org.view',

  // ==========================================
  // 4. ROLES & PERMISSIONS (RBAC) 🔐
  // ==========================================

  ROLES_VIEW: 'roles.view', // Kaunse roles available hain dekhna
  ROLES_MANAGE: 'roles.manage', // Naya custom role banana (e.g., 'Intern')

  // ==========================================
  // 5. SCHEDULING & CALENDAR 📅
  // ==========================================

  SCHEDULE_VIEW: 'schedule.view', // Calendar dekhna
  SCHEDULE_MANAGE: 'schedule.manage', // Availability slots set karna

  // ==========================================
  // 6. PROPOSALS & CONTENT 📄
  // ==========================================

  PROPOSALS_CREATE: 'proposals.create', // PDF generate karna
  PROPOSALS_VIEW: 'proposals.view', // Purane proposals dekhna

  // ==========================================
  // 7. AUTOMATION & SETTINGS 🤖
  // ==========================================

  WORKFLOW_MANAGE: 'workflow.manage', // Email automation rules set karna
  SYSTEM_SETTINGS: 'system.settings', // General configuration
};
