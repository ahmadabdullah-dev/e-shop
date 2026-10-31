import { useState } from "react";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { useCancelOrder } from "../../lib/hooks/useOrder";
import {
  useDeliverOrder,
  usePendingOrder,
  useProcessOrder,
  useShipOrder,
} from "../../lib/hooks/useAdmin";

type Toast = { text: string; type: "success" | "error" };

const getErrorMessage = (err: unknown) => {
  if (axios.isAxiosError(err))
    return err.response?.data?.message ?? err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong";
};

const getSuccessMessage = (data: unknown) =>
  (data as { message?: string } | undefined)?.message ?? "Done";

export default function OrderOptions({ orderId }: { orderId: string }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const actions = [
    {
      label: "Pending",
      icon: <HourglassEmptyIcon />,
      color: "warning",
      mutation: usePendingOrder(orderId),
    },
    {
      label: "Process",
      icon: <SettingsIcon />,
      color: "info",
      mutation: useProcessOrder(orderId),
    },
    {
      label: "Ship",
      icon: <LocalShippingIcon />,
      color: "primary",
      mutation: useShipOrder(orderId),
    },
    {
      label: "Deliver",
      icon: <CheckCircleIcon />,
      color: "success",
      mutation: useDeliverOrder(orderId),
    },
    {
      label: "Cancel",
      icon: <CancelIcon />,
      color: "error",
      mutation: useCancelOrder(orderId),
    },
  ] as const;

  const busy = actions.some((a) => a.mutation.isPending);

  const callbacks = {
    onSuccess: (data: unknown) =>
      setToast({ text: getSuccessMessage(data), type: "success" }),
    onError: (err: unknown) =>
      setToast({ text: getErrorMessage(err), type: "error" }),
  };

  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
        Update order status
      </Typography>

      <Stack spacing={1.5}>
        {actions.map(({ label, icon, color, mutation }) => (
          <Button
            key={label}
            color={color}
            variant={label === "Cancel" ? "outlined" : "contained"}
            disabled={busy}
            startIcon={
              mutation.isPending ? (
                <CircularProgress size={18} color="inherit" />
              ) : (
                icon
              )
            }
            onClick={() => mutation.mutate(undefined, callbacks)}
            sx={{ textTransform: "none", fontWeight: 600, minWidth: 120 }}
          >
            {label}
          </Button>
        ))}
      </Stack>

      <Snackbar
        open={!!toast}
        autoHideDuration={4000}
        onClose={() => setToast(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={toast?.type}
          variant="filled"
          onClose={() => setToast(null)}
        >
          {toast?.text}
        </Alert>
      </Snackbar>
    </Box>
  );
}
