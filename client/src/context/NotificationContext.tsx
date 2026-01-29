"use client";
import { createContext, useContext, useState } from "react";
import Notification from "../component/Notification";

type NotifyType = "success" | "error" | "info" | "warning";

interface NotificationContextType {
  notify: (msg: string, type?: NotifyType) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, setState] = useState({
    open: false,
    message: "",
    type: "success" as NotifyType,
  });

  const notify = (message: string, type: NotifyType = "success") => {
    setState({ open: true, message, type });
  };

  const close = () => setState((p) => ({ ...p, open: false }));

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}

      {/* GLOBAL SNACKBAR */}
      <Notification
        open={state.open}
        message={state.message}
        type={state.type}
        onClose={close}
      />
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error("useNotification must be used inside NotificationProvider");
  }
  return ctx;
};
