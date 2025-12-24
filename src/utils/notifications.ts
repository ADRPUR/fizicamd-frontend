import type { AlertColor } from "@mui/material";

export type ToastPayload = {
  message: string;
  severity?: AlertColor;
  duration?: number;
};

type ToastListener = (payload: ToastPayload) => void;

const listeners = new Set<ToastListener>();

export function notify(payload: ToastPayload) {
  listeners.forEach((listener) => listener(payload));
}

export function subscribeToToasts(listener: ToastListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
