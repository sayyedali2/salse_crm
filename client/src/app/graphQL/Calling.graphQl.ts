import { gql } from "@apollo/client";

export const GET_SCHEDULED_CALLS = gql`
  query GetScheduledCalls($leadId: String) {
    getScheduledCalls(leadId: $leadId) {
      _id
      leadId {
        _id
        name
        phone
      }
      sheduleTime
      status
    }
  }
`;

export const SCHEDULE_CALL = gql`
  mutation SheduleCall($data: CallingSheduleInput!) {
    sheduleCall(data: $data) {
      _id
      sheduleTime
      status
    }
  }
`;

export const DELETE_SCHEDULED_CALL = gql`
  mutation DeleteScheduledCall($id: String!) {
    deleteScheduledCall(id: $id) {
      _id
    }
  }
`;
