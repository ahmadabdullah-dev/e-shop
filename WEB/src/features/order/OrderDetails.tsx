import { useParams } from "react-router";
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import { useGetOrderById } from "../../lib/hooks/useOrder";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useGetOrderById(id ?? "");
console.log(order);
  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity={error ? "info" : "error"} variant="outlined">
          {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Grid container spacing={{ xs: 4, md: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h3" component="h1">
              Order #{order?.id}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {order?.totalPrice != null
                ? `$${Number(order.totalPrice).toFixed(2)}`
                : "—"}
            </Typography>

            <Divider />

            <Typography sx={{ color: "text.secondary" }}>
              Ship to: {order?.shippingAddress || "—"}
            </Typography>

            {order?.createdAt && (
              <Typography sx={{ color: "text.secondary" }}>
                Placed on {new Date(order.createdAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
