"use client";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Link,
  Box,
} from "@mui/material";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNotification } from "@/context/NotificationContext";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { ForgatPassword } from "../ForgatPassword/forgatPassword";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginMutation = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        name
        email
        organizationId {
          _id
        }
        role {
          name
        }
        status
        avatar
        phone
      }
    }
  }
`;

interface LoginData {
  login: {
    accessToken: string;
    user: {
      name: string;
      email: string;
      organizationId: {
        _id: string;
      };
      role: {
        name: string;
      };
      status: string;
      avatar: string;
      phone: string;
    };
  };
}

interface LoginVars {
  input: {
    email: string;
    password: string;
  };
}

export function Login({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const { notify } = useNotification();
  const [login] = useMutation<LoginData, LoginVars>(loginMutation);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [openForgetPassword, setOpenForgetPassword] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await login({ variables: { input: data } });
      if (res.data?.login?.accessToken) {
        localStorage.setItem("accessToken", res.data.login.accessToken);
        notify("Login Successfully!!!");
        reset();
        setOpen(false);
        router.push("/overview");
      }
    } catch (error: any) {
      notify(error.message || "Something went wrong!!!");
    }
  });

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        // 'sm' ya 'xs' maxWidth set karne se mobile par dialog natural lagega
        maxWidth="sm"
        PaperProps={{
          sx: {
            // Mobile par height 'auto' rakhte hain taki keyboard space le sake
            // Desktop par '65vh' maintain kar sakte hain
            height: { xs: "auto", md: "66vh" },

            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: { xs: 2, sm: 3 }, // Mobile par thoda kam padding
            borderRadius: "16px", // Thoda modern look
          },
        }}
      >
        <IconButton
          onClick={() => {
            setOpen(false);
            router.push("/");
          }}
          sx={{
            color: "text.secondary",
            "&:hover": { color: "text.primary", bgcolor: "action.hover" },
            height: "40px",
            width: "40px",
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 1, // Taki ye upar rahe
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogTitle
          variant="h4"
          textAlign="center"
          sx={{
            mt: 2,
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", md: "2.125rem" }, // Mobile par heading thodi chhoti
          }}
        >
          Login
        </DialogTitle>

        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: { xs: 1, md: 2 },
            overflowY: "visible", // Scrolling issues se bachne ke liye
          }}
        >
          <TextField
            fullWidth
            label="Email"
            {...register("email")}
            placeholder="xyz@gmail.com"
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            fullWidth
            type="password" // Password field ko mask karne ke liye
            label="Password"
            {...register("password")}
            placeholder="********"
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          <Link
            onClick={() => {
              setOpen(false);
              setOpenForgetPassword(true);
            }}
            sx={{
              alignSelf: "flex-end", // textAlign se behtar flex align hai
              fontSize: "0.875rem",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            forgot password?
          </Link>
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "center",
            pb: 3, // Bottom padding for better spacing
            px: 3,
          }}
        >
          <Button
            onClick={onSubmit}
            variant="outlined" // Login ke liye 'contained' zyada clickable lagta hai
            sx={{
              py: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "1rem",
              width: "50%",
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
      <ForgatPassword
        open={openForgetPassword}
        setOpen={setOpenForgetPassword}
      />
    </>
  );
}
