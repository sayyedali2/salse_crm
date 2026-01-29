"use client";

import Register from "@/component/registry/registryDialog";
import {Login} from "@/component/Login/login";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useLenis } from "@studio-freight/react-lenis";
import { useRouter } from "next/navigation";

export default function InitilaizedSystem({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  // const [openRegister, setOpenRegister] = useState(false);
  const lenis = useLenis();
const router = useRouter();
  // useEffect(() => {
  //   if (open || openRegister) {
  //     lenis?.stop();
  //   } else {
  //     lenis?.start();
  //   }
  // }, [lenis, open, openRegister]);

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        disableScrollLock
        PaperProps={{
          component: "div",
          "data-lenis-prevent": true,
          sx: {
            height: "40vh", // 👈 Dialog ki total height
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 3,
          },
        }}
      >
        <DialogTitle
        variant="h4"
          sx={{
            textAlign: "center",
            color: "text.primary",
            height: "35%",
          }}
        >
          Configure your system
        </DialogTitle>
        <DialogActions
          sx={{
            justifyContent: "center",
            alignItems: "center",
            height: "35%",
            gap: 6,
          }}
        >
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.paper",
              color: "primary.text",
              width: "40%",
            }}
            onClick={() => {
             router.push("/register");
            }}
          >
            Register
          </Button>
          <Button
            variant="outlined"
            sx={{
              bgcolor: "primary.paper",
              color: "primary.text",
              width: "40%",
            }}
            onClick={()=>{
              router.push("/login");
            }}
          >
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
