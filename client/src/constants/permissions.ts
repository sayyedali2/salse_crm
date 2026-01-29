export const PERMISSIONS = {
  // ==========================================
  // 1. LEADS MANAGEMENT
  // ==========================================
  LEADS_VIEW_ALL: "leads.view_all",
  LEADS_VIEW_OWN: "leads.view_own",
  LEADS_CREATE: "leads.create",
  LEADS_EDIT: "leads.edit",
  LEADS_DELETE: "leads.delete",
  LEADS_ASSIGN: "leads.assign",
  LEADS_IMPORT: "leads.import",
  LEADS_EXPORT: "leads.export",

  // ==========================================
  // 2. TEAM & USER MANAGEMENT
  // ==========================================
  USERS_VIEW: "users.view",
  USERS_CREATE: "users.create",
  USERS_EDIT: "users.edit",
  USERS_DELETE: "users.delete",

  // ==========================================
  // 3. ORGANIZATION & BILLING
  // ==========================================
  ORG_UPDATE: "org.update",
  ORG_BILLING: "org.billing",
  ORG_DELETE: "org.delete",
  ORG_VIEW: "org.view",

  // ==========================================
  // 4. ROLES & PERMISSIONS
  // ==========================================
  ROLES_VIEW: "roles.view",
  ROLES_MANAGE: "roles.manage",

  // ==========================================
  // 5. SCHEDULING & CALENDAR
  // ==========================================
  SCHEDULE_VIEW: "schedule.view",
  SCHEDULE_MANAGE: "schedule.manage",

  // ==========================================
  // 6. PROPOSALS & CONTENT
  // ==========================================
  PROPOSALS_CREATE: "proposals.create",
  PROPOSALS_VIEW: "proposals.view",

  // ==========================================
  // 7. AUTOMATION & SETTINGS
  // ==========================================
  WORKFLOW_MANAGE: "workflow.manage",
  SYSTEM_SETTINGS: "system.settings",
};

// Helper for UI grouping
export const PERMISSION_GROUPS = [
  {
    category: "Leads",
    items: [
      { label: "View All Leads", value: PERMISSIONS.LEADS_VIEW_ALL },
      { label: "View Own Leads", value: PERMISSIONS.LEADS_VIEW_OWN },
      { label: "Create Leads", value: PERMISSIONS.LEADS_CREATE },
      { label: "Edit Leads", value: PERMISSIONS.LEADS_EDIT },
      { label: "Delete Leads", value: PERMISSIONS.LEADS_DELETE },
      { label: "Assign Leads", value: PERMISSIONS.LEADS_ASSIGN },
      { label: "Import Leads", value: PERMISSIONS.LEADS_IMPORT },
      { label: "Export Leads", value: PERMISSIONS.LEADS_EXPORT },
    ],
  },
  {
    category: "Users",
    items: [
      { label: "View Users", value: PERMISSIONS.USERS_VIEW },
      { label: "Create Users", value: PERMISSIONS.USERS_CREATE },
      { label: "Edit Users", value: PERMISSIONS.USERS_EDIT },
      { label: "Delete Users", value: PERMISSIONS.USERS_DELETE },
    ],
  },
  {
    category: "Organization",
    items: [
      { label: "View Org", value: PERMISSIONS.ORG_VIEW },
      { label: "Update Org", value: PERMISSIONS.ORG_UPDATE },
      { label: "Billing", value: PERMISSIONS.ORG_BILLING },
      { label: "Delete Org", value: PERMISSIONS.ORG_DELETE },
    ],
  },
  {
    category: "Roles",
    items: [
      { label: "View Roles", value: PERMISSIONS.ROLES_VIEW },
      { label: "Manage Roles", value: PERMISSIONS.ROLES_MANAGE },
    ],
  },
  {
    category: "Schedule",
    items: [
      { label: "View Schedule", value: PERMISSIONS.SCHEDULE_VIEW },
      { label: "Manage Schedule", value: PERMISSIONS.SCHEDULE_MANAGE },
    ],
  },
  {
    category: "Proposals",
    items: [
      { label: "View Proposals", value: PERMISSIONS.PROPOSALS_VIEW },
      { label: "Create Proposals", value: PERMISSIONS.PROPOSALS_CREATE },
    ],
  },
  {
    category: "Settings",
    items: [
      { label: "Workflow Manage", value: PERMISSIONS.WORKFLOW_MANAGE },
      { label: "System Settings", value: PERMISSIONS.SYSTEM_SETTINGS },
    ],
  },
];
