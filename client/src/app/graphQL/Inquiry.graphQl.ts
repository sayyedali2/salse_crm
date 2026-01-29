import { gql } from "@apollo/client";

export const GET_INQUIRIES = gql`
  query GetInquiries($skip: Int!, $take: Int!) {
    getInquiries(skip: $skip, take: $take) {
      totalCount
      items {
        _id
        firstName
        lastName
        email
        companyName
        message
        createdAt
      }
    }
  }
`;

export const CREATE_INQUIRY = gql`
  mutation CreateInquiry($input: CreateInquiryInput!) {
    createInquiry(createInquiryInput: $input) {
      _id
      email
    }
  }
`;

export interface InquiryData {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  companyName?: string;
  message: string;
  createdAt: string;
}

export interface GetInquiriesResponse {
  getInquiries: {
    items: InquiryData[];
    totalCount: number;
  };
}
