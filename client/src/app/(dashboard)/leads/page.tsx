"use client";
import LeadsTable from "@/component/dashboard/leads/table";
import TitleBox from "@/component/dashboard/titleBox";
import Loader from "@/component/loding";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/navigation";
import { LEAD_UPDATED_SUBSCRIPTION } from "@/app/graphQL/Lead.graphQl";
import EmailServiceAlert from "@/component/emailServiceAlert";

const GET_LEADS = gql`
  query GetLeads($skip: Int!, $take: Int!) {
    leads(skip: $skip, take: $take) {
      totalCount
      items {
        _id
        name
        email
        phone
        status
        assignedTo {
          _id
          name
        }
        source
        budget
        serviceType
      }
    }
    emailServiceStatus
  }
`;

const ON_LEAD_ADDED_SUBSCRIPTION = gql`
  subscription OnLeadAdded {
    leadAdded {
      _id
      name
      email
      phone
      status
      budget
      serviceType
      assignedTo {
        _id
        name
      }
      source
    }
  }
`;

const ON_LEAD_DELETED_SUBSCRIPTION = gql`
  subscription OnLeadDeleted {
    leadDeleted
  }
`;

const ON_LEAD_UPDATED_SUBSCRIPTION = gql`
  subscription OnLeadUpdated {
    leadUpdated {
      _id
      name
      email
      phone
      status
      budget
      serviceType
      assignedTo {
        _id
        name
      }
      source
    }
  }
`;

export interface LeadsData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status?: string;
  assignedTo?: {
    _id: string;
    name: string;
  } | null;
  source?: string;
  budget: number;
  serviceType: string;
}

interface GetLeadsResponse {
  leads: {
    items: LeadsData[];
    totalCount: number;
  };
  emailServiceStatus: boolean;
}

interface LeadAddedSubscription {
  leadAdded: LeadsData;
}

interface LeadDeletedSubscription {
  leadDeleted: string;
}

interface LeadUpdatedSubscription {
  leadUpdated: LeadsData;
}

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data, loading, error, subscribeToMore, refetch } =
    useQuery<GetLeadsResponse>(GET_LEADS, {
      variables: {
        skip: (page - 1) * rowsPerPage,
        take: rowsPerPage,
      },
      // Cache policy adds stability
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    // Lead ADD Subscription
    const unsubscribeAdd = subscribeToMore<LeadAddedSubscription>({
      document: ON_LEAD_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetLeadsResponse;
        const newLead = subscriptionData.data.leadAdded;

        const prevData = prev as GetLeadsResponse;
        if (!prevData || !prevData.leads || !prevData.leads.items)
          return prevData;

        // Check if already exists to avoid duplicates
        const exists = prevData.leads.items.some(
          (item) => item._id === newLead._id,
        );
        if (exists) return prevData;

        return {
          ...prevData,
          leads: {
            ...prevData.leads,
            totalCount: (prevData.leads.totalCount || 0) + 1,
            // Naya lead hamesha top par dikhane ke liye (sirf page 1 par)
            items:
              page === 1
                ? [newLead, ...prevData.leads.items].slice(0, rowsPerPage)
                : prevData.leads.items,
          },
        };
      },
    });

    // Lead DELETE Subscription
    const unsubscribeDelete = subscribeToMore<LeadDeletedSubscription>({
      document: ON_LEAD_DELETED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetLeadsResponse;
        const deletedId = subscriptionData.data.leadDeleted;

        const prevData = prev as GetLeadsResponse;
        if (!prevData || !prevData.leads || !prevData.leads.items)
          return prevData;

        const filteredItems = prevData.leads.items.filter(
          (item) => item._id !== deletedId,
        );

        // Agar item delete hua hai toh count kam karo
        const wasInList = filteredItems.length !== prevData.leads.items.length;

        return {
          ...prevData,
          leads: {
            ...prevData.leads,
            totalCount: wasInList
              ? (prevData.leads.totalCount || 0) - 1
              : prevData.leads.totalCount || 0,
            items: filteredItems,
          },
        };
      },
    });

    const updateSubscription = subscribeToMore<LeadUpdatedSubscription>({
      document: ON_LEAD_UPDATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetLeadsResponse;
        const updatedLead = subscriptionData.data.leadUpdated;

        const prevData = prev as GetLeadsResponse;
        if (!prevData || !prevData.leads || !prevData.leads.items)
          return prevData;

        const updatedItems = prevData.leads.items.map((item) => {
          if (item._id === updatedLead._id) {
            return updatedLead;
          }
          return item;
        });
        return {
          ...prevData,
          leads: {
            ...prevData.leads,
            items: updatedItems,
          },
        };
      },
    });

    return () => {
      unsubscribeAdd();
      unsubscribeDelete();
      updateSubscription();
    };
  }, [subscribeToMore, page]);

  // Handle empty page after deletion
  useEffect(() => {
    if (!loading && data?.leads.items.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [data, loading, page]);

  if (loading) return <Loader message="Fetching Leads..." />;
  if (error)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          height: "80vh",
          textAlign: "center",
          px: 3,
        }}
      >
        {/* Animated Error Icon */}
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: "#ff1d1dff",
            mb: 2,
            animation: "shake 0.5s ease-in-out",
            "@keyframes shake": {
              "0%, 100%": { transform: "translateX(0)" },
              "25%": { transform: "translateX(-5px)" },
              "75%": { transform: "translateX(5px)" },
            },
          }}
        />

        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          Error
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "#666", mb: 3, maxWidth: "400px" }}
        >
          {error.message ||
            "Server se connect nahi ho pa rahe hain. Dubara koshish karein."}
        </Typography>
      </Box>
    );

  const leads = data?.leads.items || [];
  const totalCount = data?.leads.totalCount || 0;

  const isEmailEnabled = data?.emailServiceStatus;

  return (
    <>
      <Typography
        variant="h4"
        sx={{ fontWeight: 900, mb: 4, letterSpacing: -1 }}
      >
        Leads Dashboard
      </Typography>
      {isEmailEnabled === false && (
        <EmailServiceAlert isEnabled={isEmailEnabled} />
      )}
      <TitleBox
        titleOne="Total Leads"
        titleOneValue={totalCount.toString()}
        titleTwo="Total Budget"
        titleTwoValue={
          "₹ " + leads.reduce((acc: any, lead: any) => acc + lead.budget, 0)
        }
      />
      <LeadsTable
        leads={leads}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onLeadAdded={() => refetch()}
      />
    </>
  );
}
