import { gql } from "@apollo/client";

export const GET_ME = gql`
  query GetMe {
    findMe {
      _id
      name
      email
      role {
        name
      }
    }
  }
`;

export interface UserData {
  findMe: {
    _id: string;
    name: string;
    email: string;
    role: {
      name: string;
    };
  };
}
