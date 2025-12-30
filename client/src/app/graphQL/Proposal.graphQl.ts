import { gql } from "@apollo/client";

export const SEND_PROPOSAL_MUTATION = gql`
  mutation SendProposal($id: String!) {
    sendProposal(id: $id)
  }
`;