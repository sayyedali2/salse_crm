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
    }
  }
`;


export const DELETE_LEAD = gql`
  mutation deleteLead($id: String!) {
    deleteLead(id: $id)
  }
`;
