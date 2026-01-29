import React, { useState, useMemo, useEffect } from "react";
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import debounce from "lodash/debounce";
import { useLazyQuery } from "@apollo/client/react";
import { gql } from "@apollo/client";

interface User {
  _id: string;
  name: string;
  email: string;
  activeLeadsCount: number;
}

interface SearchUsersData {
  searchUsers: User[];
}

interface SearchUsersVars {
  search: string;
}

const SEARCH_USERS = gql`
  query SearchUsers($search: String!) {
    searchUsers(search: $search) {
      _id
      name
      email
    }
  }
`;

interface AgentSearchAutocompleteProps {
  onSelect: (id: string) => void;
  defaultValue?: User | null;
}

export default function AgentSearchAutocomplete({
  onSelect,
  defaultValue = null,
}: AgentSearchAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // 1. Lazy Query: Taaki hum manually trigger kar sakein
  const [fetchUsers, { loading, data }] = useLazyQuery<
    SearchUsersData,
    SearchUsersVars
  >(SEARCH_USERS);

  // Debugging: Log data
  console.log("Autocomplete Data:", data);

  // 2. Debounce Logic: Taaki har keypress par API call na ho (500ms wait)
  const debouncedFetch = useMemo(
    () =>
      debounce((search: string) => {
        fetchUsers({ variables: { search } });
      }, 500),
    [fetchUsers],
  );

  // 3. Trigger fetch when dropdown opens
  useEffect(() => {
    if (open) {
      fetchUsers({ variables: { search: inputValue || "" } });
    }
  }, [open, fetchUsers, inputValue]);

  // 4. Input change handle karo
  const handleInputChange = (event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    debouncedFetch(newInputValue);
  };

  const options = data?.searchUsers || [];

  return (
    <Autocomplete
      id="agent-search-select"
      sx={{ width: "100%" }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      // Critical: Backend filter kar raha hai, toh MUI ka default filter band kar do
      filterOptions={(x) => x}
      options={options}
      loading={loading}
      getOptionLabel={(option: User) => option.name}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      onInputChange={handleInputChange}
      onChange={(event, newValue: User | null) => {
        if (newValue) onSelect(newValue._id);
      }}
      // "Top-Level" UI: Dropdown mein hi count dikhao
      renderOption={(props, option) => (
        <Box
          component="li"
          {...props}
          key={option._id}
          sx={{
            display: "flex",
            justifyContent: "space-between !important",
            alignItems: "center",
            p: 1,
          }}
        >
          <Box>
            <Typography variant="body1">{option.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {option.email}
            </Typography>
          </Box>
          <Chip
            label={`${option.activeLeadsCount} Leads`}
            size="small"
            color={option.activeLeadsCount > 5 ? "warning" : "success"}
          />
        </Box>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Agent to Assign"
          variant="outlined"
          placeholder="Type name or email..."
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
