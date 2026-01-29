"use client";
import TeamTable from "@/component/dashboard/superAdmin/table";
import InquiryTable from "@/component/dashboard/superAdmin/inquiryTable";
import TitleBox from "@/component/dashboard/titleBox";
import Loader from "@/component/loding";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Box, Button, Stack, Typography, Tabs, Tab } from "@mui/material";
import { useEffect, useState } from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ViewDialog from "@/component/dashboard/superAdmin/viewDiloag";
import { useRouter } from "next/navigation";
import {
  OrganizationData,
  GetOrganizationResponse,
  GET_ORGANIZATION,
} from "@/app/graphQL/Organization.graphQl";
import {
  GET_INQUIRIES,
  GetInquiriesResponse,
  InquiryData,
} from "@/app/graphQL/Inquiry.graphQl";
import { GET_ME, UserData } from "@/app/graphQL/User.graphQl";

const SUBSCRIPTION_DELETE_ORG = gql`
  subscription OrganizationDeleted {
    organizationDeleted # Yeh server se deleted ID return karega
  }
`;

interface SubscriptionDeleteOrgResponse {
  organizationDeleted: string; // Deleted ID string hoti hai
}

export default function LeadsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  // Check Role
  const { data: userData, loading: userLoading } = useQuery<UserData>(GET_ME);

  // Organization State
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [createOpen, setCreateOpen] = useState(false);

  // Inquiry State
  const [inquiryPage, setInquiryPage] = useState(1);

  useEffect(() => {
    if (!userLoading && userData?.findMe?.role?.name !== "Super Admin") {
      // Redirect if not Super Admin
      // router.push("/leads");
    }
  }, [userData, userLoading, router]);

  // -- Organization Query --
  const {
    data: orgData,
    loading: orgLoading,
    error: orgError,
    subscribeToMore,
  } = useQuery<GetOrganizationResponse>(GET_ORGANIZATION, {
    variables: {
      skip: (page - 1) * rowsPerPage,
      take: rowsPerPage,
    },
    fetchPolicy: "cache-and-network",
    skip: userData?.findMe?.role?.name !== "Super Admin",
  });

  // -- Inquiry Query --
  const {
    data: inquiryData,
    loading: inquiryLoading,
    error: inquiryError,
  } = useQuery<GetInquiriesResponse>(GET_INQUIRIES, {
    variables: {
      skip: (inquiryPage - 1) * rowsPerPage,
      take: rowsPerPage,
    },
    fetchPolicy: "cache-and-network",
    skip: userData?.findMe?.role?.name !== "Super Admin",
  });

  // Subscription logic fix
  useEffect(() => {
    const unsubscribeDelete = subscribeToMore<SubscriptionDeleteOrgResponse>({
      document: SUBSCRIPTION_DELETE_ORG,
      updateQuery: (prev, { subscriptionData }): GetOrganizationResponse => {
        if (!subscriptionData.data || !prev?.findAll)
          return prev as GetOrganizationResponse;

        const deletedId = subscriptionData.data.organizationDeleted;

        return {
          findAll: {
            ...prev.findAll,
            items: (prev.findAll.items || []).filter(
              (item: any) => item?._id !== deletedId,
            ) as OrganizationData[],
            totalCount: Math.max(0, (prev.findAll.totalCount || 0) - 1),
          },
        };
      },
    });
    return () => unsubscribeDelete();
  }, [subscribeToMore]);

  // Handle empty page after deletion logic
  useEffect(() => {
    if (!orgLoading && orgData?.findAll?.items?.length === 0 && page > 1) {
      setPage((prev) => prev - 1);
    }
  }, [orgData, orgLoading, page]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (userLoading) return <Loader message="Verifying Access..." />;

  if (userData?.findMe?.role?.name !== "Super Admin") {
    return (
      <Box sx={{ p: 5, textAlign: "center" }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography>You do not have permission to view this page.</Typography>
        <Button
          onClick={() => router.push("/leads")}
          sx={{ mt: 2 }}
          variant="outlined"
        >
          Go Home
        </Button>
      </Box>
    );
  }

  const loading = activeTab === 0 ? orgLoading : inquiryLoading;
  const error = activeTab === 0 ? orgError : inquiryError;

  if (loading && !orgData && !inquiryData)
    return (
      <Loader
        message={
          activeTab === 0
            ? "Fetching Organizations..."
            : "Fetching Inquiries..."
        }
      />
    );

  if (error)
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{ height: "80vh", textAlign: "center", px: 3 }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: 80,
            color: "error.main",
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
          sx={{ fontWeight: "bold", color: "text.primary" }}
        >
          Connection Error
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary", mt: 1 }}>
          {error.message || "Server se connect nahi ho pa rahe hain."}
        </Typography>
      </Box>
    );

  const organizations = (orgData?.findAll?.items || []) as OrganizationData[];
  const totalOrgCount = orgData?.findAll?.totalCount || 0;

  const inquiries = (inquiryData?.getInquiries?.items || []) as InquiryData[];
  const totalInquiryCount = inquiryData?.getInquiries?.totalCount || 0;

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            letterSpacing: -1,
            fontSize: { xs: "1.5rem", md: "2.125rem" },
          }}
          textAlign="center"
        >
          Super Admin <span style={{ color: "#00f3ff" }}>Dashboard</span>
        </Typography>
        {activeTab === 0 && (
          <Button
            variant="contained"
            sx={{
              bgcolor: "#00f3ff",
              color: "#000",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#00dbe6" },
            }}
            onClick={() => setCreateOpen(true)}
          >
            Create Organization
          </Button>
        )}
      </Stack>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          indicatorColor="secondary"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#00f3ff" },
            "& .Mui-selected": { color: "#00f3ff !important" },
          }}
        >
          <Tab label="Organizations" sx={{ fontWeight: "bold" }} />
          <Tab label="Inquiries" sx={{ fontWeight: "bold" }} />
        </Tabs>
      </Box>

      {activeTab === 0 ? (
        <>
          <TitleBox
            titleOne="Total Organizations"
            titleOneValue={totalOrgCount.toString()}
            titleTwo="Active Items"
            titleTwoValue={organizations.length.toString()}
          />

          <TeamTable
            Organization={organizations}
            totalCount={totalOrgCount}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
          />
        </>
      ) : (
        <>
          <TitleBox
            titleOne="Total Inquiries"
            titleOneValue={totalInquiryCount.toString()}
            titleTwo="Recent"
            titleTwoValue={inquiries.length.toString()}
          />
          <InquiryTable
            inquiries={inquiries}
            totalCount={totalInquiryCount}
            page={inquiryPage}
            setPage={setInquiryPage}
            rowsPerPage={rowsPerPage}
          />
        </>
      )}

      <ViewDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        user={null}
      />
    </>
  );
}
