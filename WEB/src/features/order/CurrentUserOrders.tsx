import { useState } from "react";
import { Link } from "react-router";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  Pagination,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import type { PaginationParams } from "../../lib/types/common";
import type { OrderDto } from "../../lib/types/order"; // adjust path
import { useGetCurrentUserOrders } from "../../lib/hooks/useOrder";

const PAGE_SIZE = 12;

const currencyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
const dateFormat = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const formatPrice = (value: string) => {
  const n = Number(value);
  return Number.isFinite(n) ? currencyFormat.format(n) : value;
};

const formatDate = (value: string) => {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : dateFormat.format(d);
};

const shortId = (id: string) => `#${id.slice(0, 8).toUpperCase()}`;

function OrderCard({ order }: { order: OrderDto }) {
  const itemCount = order.products.reduce((sum, p) => sum + p.quantity, 0);

  return (
    <Card variant="outlined">
      <CardActionArea
        component={Link}
        to={`/order/${order.id}`}
        sx={{
          p: 2.5,
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }} noWrap>
            Order {shortId(order.id)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(order.createdAt)}
            {formatDate(order.createdAt) && " • "}
            {itemCount} {itemCount === 1 ? "item" : "items"}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            Ships to {order.shippingAddress}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 600, flexShrink: 0 }}>
          {formatPrice(order.totalPrice)}
        </Typography>
      </CardActionArea>
    </Card>
  );
}

function OrdersSkeleton() {
  return (
    <Stack spacing={2} aria-busy="true" aria-label="Loading orders">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} variant="rounded" height={96} />
      ))}
    </Stack>
  );
}

export default function CurrentUserOrders() {
  const [pagination, setPagination] = useState<PaginationParams>({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  const { data, isPending, isError, error, refetch } =
    useGetCurrentUserOrders(pagination);

  const handlePageChange = (_: unknown, page: number) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let content: React.ReactNode;

  if (isPending) {
    content = <OrdersSkeleton />;
  } else if (isError) {
    content = (
      <Alert
        severity="error"
        action={
          <Button color="inherit" size="small" onClick={() => refetch()}>
            Retry
          </Button>
        }
      >
        {error.message}
      </Alert>
    );
  } else if (!data || data.items.length === 0) {
    content = (
      <Alert
        severity="info"
        action={
          <Button
            color="inherit"
            size="small"
            component={Link}
            to="/products" // adjust to your products route
          >
            Browse products
          </Button>
        }
      >
        You haven't placed any orders yet.
      </Alert>
    );
  } else {
    content = (
      <>
        <Stack spacing={2}>
          {data.items.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </Stack>

        {data.totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <Pagination
              count={data.totalPages}
              page={data.currentPage}
              onChange={handlePageChange}
            />
          </Box>
        )}
      </>
    );
  }

  return (
    <Box component="section" sx={{ maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Your orders
      </Typography>
      {content}
    </Box>
  );
}
