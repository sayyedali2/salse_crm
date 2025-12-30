
import { gql } from "@apollo/client";

export const UPDATE_STATUS_MUTATION = gql`
  mutation UpdateStatus($id: String!, $status: String!) {
    updateLeadStatus(id: $id, status: $status) {
      _id
      status
    }
  }
`;