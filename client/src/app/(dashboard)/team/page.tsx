"use client";
import TeamTable from "@/component/dashboard/team/table";
import TitleBox from "@/component/dashboard/titleBox";
import Loader from "@/component/loding";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useRouter } from "next/navigation";
import { LEAD_UPDATED_SUBSCRIPTION } from "@/app/graphQL/Lead.graphQl";

const GET_TEAM_MEMBERS = gql`
  query GetTeamMembers($skip: Int!, $take: Int!) {
    findAllUsers(skip: $skip, take: $take) {
      totalCount
      items {
        _id
        name
        email
        phone
        role {
          _id
          name
        }
        status
        activeLeadsCount
      }
    }
  }
`;

const ON_TEAM_MEMBER_ADDED_SUBSCRIPTION = gql`
  subscription OnTeamMemberAdded {
    userAdded {
      _id
      name
      email
      phone
      role {
        _id
        name
      }
      status
      activeLeadsCount
    }
  }
`;

const ON_TEAM_MEMBER_DELETED_SUBSCRIPTION = gql`
  subscription OnTeamMemberDeleted {
    userDeleted
  }
`;

const ON_TEAM_MEMBER_UPDATED_SUBSCRIPTION = gql`
  subscription OnTeamMemberUpdated {
    userUpdated {
      _id
      name
      email
      phone
      role {
        _id
        name
      }
      status
      activeLeadsCount
    }
  }
`;

const SETUP_ACCOUNT_SUBSCRIPTION = gql`
  subscription SetUpAccount {
    SetUpAccount {
      user {
        _id
        name
        email
        phone
        role {
          _id
          name
        }
        status
        activeLeadsCount
      }
    }
  }
`;

export interface TeamData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  role: {
    _id: string;
    name: string;
  };
  activeLeadsCount: number;
}

interface GetTeamMembersResponse {
  findAllUsers: {
    items: TeamData[];
    totalCount: number;
  };
}

interface TeamMemberAddedSubscription {
  userAdded: TeamData;
}

interface TeamMemberDeletedSubscription {
  userDeleted: string;
}

interface TeamMemberUpdatedSubscription {
  userUpdated: TeamData;
}

interface SetUpAccountSubscription {
  SetUpAccount: {
    user: TeamData;
  };
}

export default function LeadsPage() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { data, loading, error, subscribeToMore, refetch } =
    useQuery<GetTeamMembersResponse>(GET_TEAM_MEMBERS, {
      variables: {
        skip: (page - 1) * rowsPerPage,
        take: rowsPerPage,
      },
      // Cache policy adds stability
      fetchPolicy: "cache-and-network",
    });

  useEffect(() => {
    // Lead ADD Subscription
    const unsubscribeAdd = subscribeToMore<TeamMemberAddedSubscription>({
      document: ON_TEAM_MEMBER_ADDED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetTeamMembersResponse;
        const newLead = subscriptionData.data.userAdded;

        const prevData = prev as GetTeamMembersResponse;
        if (!prevData || !prevData.findAllUsers || !prevData.findAllUsers.items)
          return prevData;

        // Check if already exists to avoid duplicates
        const exists = prevData.findAllUsers.items.some(
          (item) => item._id === newLead._id,
        );
        if (exists) return prevData;

        return {
          findAllUsers: {
            ...prevData.findAllUsers,
            totalCount: (prevData.findAllUsers.totalCount || 0) + 1,
            // Naya lead hamesha top par dikhane ke liye (sirf page 1 par)
            items:
              page === 1
                ? [newLead, ...prevData.findAllUsers.items].slice(
                    0,
                    rowsPerPage,
                  )
                : prevData.findAllUsers.items,
          },
        };
      },
    });

    // Lead DELETE Subscription
    const unsubscribeDelete = subscribeToMore<TeamMemberDeletedSubscription>({
      document: ON_TEAM_MEMBER_DELETED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetTeamMembersResponse;
        const deletedId = subscriptionData.data.userDeleted;

        const prevData = prev as GetTeamMembersResponse;
        if (!prevData || !prevData.findAllUsers || !prevData.findAllUsers.items)
          return prevData;

        const filteredItems = prevData.findAllUsers.items.filter(
          (item) => item._id !== deletedId,
        );

        // Agar item delete hua hai toh count kam karo
        const wasInList =
          filteredItems.length !== prevData.findAllUsers.items.length;

        return {
          findAllUsers: {
            ...prevData.findAllUsers,
            totalCount: wasInList
              ? (prevData.findAllUsers.totalCount || 0) - 1
              : prevData.findAllUsers.totalCount || 0,
            items: filteredItems,
          },
        };
      },
    });

    const updateSubscription = subscribeToMore<TeamMemberUpdatedSubscription>({
      document: ON_TEAM_MEMBER_UPDATED_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev as GetTeamMembersResponse;
        const updatedLead = subscriptionData.data.userUpdated;
        const prevData = prev as GetTeamMembersResponse;
        if (!prevData || !prevData.findAllUsers || !prevData.findAllUsers.items)
          return prevData;
        const updatedItems = prevData.findAllUsers.items.map((item) => {
          if (item._id === updatedLead._id) {
            return updatedLead;
          }
          return item;
        });
        return {
          ...prevData,
          findAllUsers: {
            ...prevData.findAllUsers,
            items: updatedItems,
          },
        };
      },
    });

    const setupAccountSubscription = subscribeToMore<SetUpAccountSubscription>({
      document: SETUP_ACCOUNT_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        console.log("SetUpAccount subscription Fired!", subscriptionData);
        if (!subscriptionData.data) return prev as GetTeamMembersResponse;
        const updatedUser = subscriptionData.data.SetUpAccount.user;
        console.log("Updated User from sub:", updatedUser);
        const prevData = prev as GetTeamMembersResponse;

        if (!prevData?.findAllUsers?.items) return prevData;

        // Check if user exists in the list
        const userExists = prevData.findAllUsers.items.some(
          (item) => item._id === updatedUser._id,
        );
        console.log("User Exists in list:", userExists);

        if (userExists) {
          const updatedItems = prevData.findAllUsers.items.map((item) => {
            if (item._id === updatedUser._id) {
              console.log("Replacing item:", item, "with", updatedUser);
              return { ...item, ...updatedUser };
            }
            return item;
          });
          return {
            ...prevData,
            findAllUsers: {
              ...prevData.findAllUsers,
              items: updatedItems,
            },
          };
        }
        return prevData;
      },
    });

    return () => {
      unsubscribeAdd();
      unsubscribeDelete();
      updateSubscription();
      setupAccountSubscription();
    };
  }, [subscribeToMore, page]);

  // Handle empty page after deletion
  useEffect(() => {
    if (!loading && data?.findAllUsers?.items?.length === 0 && page > 1) {
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

  const team = data?.findAllUsers?.items || [];
  const totalCount = data?.findAllUsers?.totalCount || 0;

  return (
    <>
      <Typography
        variant="h4"
        sx={{ fontWeight: 900, mb: 4, letterSpacing: -1 }}
        p={1}
      >
        Team Dashboard
      </Typography>
      <TitleBox
        titleOne="Total TeamMembers"
        titleOneValue={totalCount.toString()}
        titleTwo="Total Salary"
        titleTwoValue={
          "₹ " + team.reduce((acc: any, lead: any) => acc + lead.budget, 0)
        }
      />
      <TeamTable
        TeamMembers={team}
        totalCount={totalCount}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        onLeadAdded={() => refetch()}
      />
    </>
  );
}
