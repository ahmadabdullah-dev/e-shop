import { useParams } from "react-router";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import type { ReactNode } from "react";

import { useGetOrderById } from "../../lib/hooks/useOrder";
import OrderOptions from "./OrderOptions";

type ChipColor =
  | "default"
  | "warning"
  | "info"
  | "primary"
  | "success"
  | "error";

const statusColors: Record<string, ChipColor> = {
  pending: "warning",
  processing: "info",
  shipped: "primary",
  delivered: "success",
  cancelled: "error",
};

const getStatusColor = (status?: string): ChipColor =>
  statusColors[status?.toLowerCase() ?? ""] ?? "default";

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "flex-start" }}>
      <Box sx={{ color: "text.secondary", display: "flex", pt: 0.25 }}>
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
        <Typography>{value}</Typography>
      </Box>
    </Stack>
  );
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useGetOrderById(id ?? "");

  if (!id) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" variant="outlined">
          Invalid order link.
        </Alert>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" variant="outlined">
          {error?.message ?? "Order not found."}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 4 }}
      >
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Order
        </Typography>
        <Chip
          label={order.orderStatus || "Unknown"}
          color={getStatusColor(order.orderStatus)}
          sx={{ fontWeight: 600, textTransform: "capitalize" }}
        />
      </Stack>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper
            variant="outlined"
            sx={{ p: 3, borderRadius: 3, height: "100%" }}
          >
            <Typography variant="overline" sx={{ color: "text.secondary" }}>
              Total
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
              {order.totalPrice != null
                ? `$${Number(order.totalPrice).toFixed(2)}`
                : "—"}
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3}>
              <InfoRow
                icon={<LocationOnOutlinedIcon />}
                label="Ship to"
                value={order.shippingAddress || "—"}
              />
              {order.createdAt && (
                <InfoRow
                  icon={<EventOutlinedIcon />}
                  label="Placed on"
                  value={new Date(order.createdAt).toLocaleDateString(
                    undefined,
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                />
              )}
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <OrderOptions orderId={order.id} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
