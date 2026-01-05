import { gql } from "@apollo/client";

export const GET_LEADS = gql`
  query GetLeads {
    leads {
      _id
      name
      budget
      status
      serviceType
      phone
      email
      __typename # <--- ZAROORI: Apollo cache identification ke liye
    }
  }
`;

export const UPDATE_LEAD = gql`
  mutation UpdateLead($id: String!, $data: UpdateLeadInput!) {
    UpdateLead(id: $id, data: $data) {
      _id
      name
      email
      phone
      status
      budget
      serviceType
      __typename
    }
  }
`;

export const DELETE_LEAD = gql`
  mutation deleteLead($id: String!) {
    deleteLead(id: $id)
  }
`;

export const LEAD_UPDATED_SUBSCRIPTION = gql`
  subscription OnLeadUpdated {
    leadUpdated {
      _id
      name
      budget
      status
      serviceType
      phone
      email
      __typename # <--- ISKE BINA REAL-TIME UPDATE NAHI HOGA
    }
  }
`;

export const LEAD_ADDED_SUBSCRIPTION = gql`
  subscription OnLeadAdded {
    leadAdded {
      _id
      name
      budget
      status
      serviceType
      phone
      email
      __typename # <--- ISKE BINA REAL-TIME UPDATE NAHI HOGA
    }
  }
`;

export const LEAD_DELETED_SUBSCRIPTION = gql`
  subscription OnLeadDeleted {
    leadDeleted
  }
`;