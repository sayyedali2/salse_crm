import { gql } from "@apollo/client";

export const GET_ORGANIZATION = gql`
  query GetOrganization($skip: Int!, $take: Int!) {
    findAll(skip: $skip, take: $take) {
      totalCount
      items {
        _id
        name
        domain
        logoUrl
        email
        phone
        ownerName
      }
    }
  }
`;

export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      accessToken
      user {
        _id
        name
        email
      }
    }
  }
`;

export interface OrganizationData {
  _id: string;
  name: string;
  domain: string;
  logoUrl: string;
  email: string;
  phone: string;
  ownerName: string;
}

export interface GetOrganizationResponse {
  findAll: {
    items: OrganizationData[];
    totalCount: number;
  };
}

export const DELETE_ORGANIZATION = gql`
  mutation deleteOrganization($id: String!) {
    deleteOrganization(id: $id)
  }
`;
