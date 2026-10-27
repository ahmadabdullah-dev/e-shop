import { useState } from "react";
import { Link } from "react-router";
import type { PaginationParams } from "../../lib/types/common";
import {
  Alert,
  Box,
  Card,
  CardActionArea,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { useGetAllOrders } from "../../lib/hooks/useOrder";
import { Shared } from "../../lib/shared";

const PAGE_SIZE = 12;
const COLUMNS = { xs: "1fr 1fr", md: "0.8fr 0.6fr 2fr 1fr 1fr" };

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography noWrap>{value}</Typography>
    </Box>
  );
}

export default function AllOrdersList() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const query = useGetAllOrders(pagination);

  if (query.isPending) {
    return (
      <Stack spacing={2}>
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} variant="rounded" height={72} />
        ))}
      </Stack>
    );
  }

  if (query.isError) {
    return <Alert severity="error">{query.error.message}</Alert>;
  }

  const list = query.data;

  if (!list || list.items.length === 0) {
    return <Alert severity="info">No orders found.</Alert>;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700 }}>
        Orders
      </Typography>

      <Stack spacing={2} sx={{ opacity: query.isFetching ? 0.6 : 1 }}>
        {list.items.map((order) => (
          <Card
            key={order.id}
            variant="outlined"
            sx={{ "&:hover": { borderColor: "primary.main" } }}
          >
            <CardActionArea component={Link} to={`/order/${order.id}`}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: COLUMNS,
                  gap: 2,
                  alignItems: "center",
                  px: 3,
                  py: 2,
                }}
              >
                <Field label="Order" value={`#${order.id.slice(0, 8)}`} />
                <Field
                  label="Items"
                  value={order.products.reduce((sum, p) => sum + p.quantity, 0)}
                />
                <Field label="Address" value={order.shippingAddress} />
                <Field
                  label="Date"
                  value={Shared.formatDate(order.createdAt)}
                />
                <Field
                  label="Total"
                  value={(order.totalPrice + " $")}
                />
              </Box>
            </CardActionArea>
          </Card>
        ))}
      </Stack>

      {list.totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={list.totalPages}
            page={pagination.page}
            color="primary"
            onChange={(_, page) => {
              setPagination((prev) => ({ ...prev, page }));
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        </Box>
      )}
    </Box>
  );
}
