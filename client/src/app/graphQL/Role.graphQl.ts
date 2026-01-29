import { gql } from "@apollo/client";

export const GET_ROLES = gql`
  query GetRoles {
    getRoles {
      _id
      name
      permissions
      isSystemRole
    }
  }
`;

export const CREATE_ROLE = gql`
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      _id
      name
      permissions
    }
  }
`;

export const UPDATE_ROLE = gql`
  mutation UpdateRole($input: UpdateRoleInput!) {
    updateRole(input: $input) {
      _id
      name
      permissions
    }
  }
`;

export const DELETE_ROLE = gql`
  mutation DeleteRole($roleID: String!) {
    deleteRole(roleID: $roleID) {
      _id
    }
  }
`;
