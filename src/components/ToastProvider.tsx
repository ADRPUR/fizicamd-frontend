import { Slide, Snackbar, SnackbarContent, useTheme } from "@mui/material";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { subscribeToToasts, type ToastPayload } from "../utils/notifications";

export default function ToastProvider({ children }: { children: ReactNode }) {
  const theme = useTheme();
  const [queue, setQueue] = useState<ToastPayload[]>([]);
  const [current, setCurrent] = useState<ToastPayload | null>(null);

  useEffect(() => {
    return subscribeToToasts((payload) => {
      setQueue((prev) => [...prev, payload]);
    });
  }, []);

  useEffect(() => {
    if (!current && queue.length) {
      setCurrent(queue[0]);
      setQueue((prev) => prev.slice(1));
    }
  }, [current, queue]);

  const handleClose = (_: unknown, reason?: string) => {
    if (reason === "clickaway") return;
    setCurrent(null);
  };

  return (
    <>
      {children}
      <Snackbar
        open={!!current}
        onClose={handleClose}
        TransitionComponent={Slide}
        autoHideDuration={current?.duration ?? 5000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{ zIndex: (themeArg) => themeArg.zIndex.modal + 2 }}
      >
        <SnackbarContent
          sx={{
            width: "100%",
            minWidth: { xs: 280, sm: 360 },
            maxWidth: 480,
            boxShadow: "0 18px 36px rgba(15, 23, 42, 0.28)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.2)",
            background:
              current?.severity === "success"
                ? "#0f766e"
                : current?.severity === "error"
                ? "#b91c1c"
                : current?.severity === "warning"
                ? "#b45309"
                : "#1d4ed8",
            color: "#fff",
          }}
          message={current?.message}
        />
      </Snackbar>
    </>
  );
}
