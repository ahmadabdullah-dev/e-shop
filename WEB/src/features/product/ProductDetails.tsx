import { useNavigate, useParams } from "react-router";
import { useGetProductById } from "../../lib/hooks/useProduct";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { useCurrentUser } from "../../lib/hooks/useUser";
import { useBasket } from "../../lib/hooks/useBasket";
import DeleteProduct from "./DeleteProduct";

function PageMessage({
  severity,
  children,
}: {
  severity: "error" | "info";
  children: React.ReactNode;
}) {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Alert severity={severity} variant="outlined">
        {children}
      </Alert>
    </Container>
  );
}

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductById(id ?? "");
  const { data: currentUser } = useCurrentUser();
  const { addToBasket, setQuantity, removeFromBasket, getQuantity } =
    useBasket();

  if (!id)
    return <PageMessage severity="error">Invalid product link.</PageMessage>;

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <PageMessage severity="error">
        Something went wrong while loading this product. Please try again.
      </PageMessage>
    );
  }

  if (!product)
    return <PageMessage severity="info">Product not found.</PageMessage>;

  const quantity = getQuantity(product.id);
  const hasPrice = product.price !== null && product.price !== undefined;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Button
          onClick={() => navigate("/products")}
          variant="text"
          startIcon={<ArrowBackIcon />}
          sx={{ px: 0, color: "text.secondary" }}
        >
          Go to products
        </Button>

        {currentUser?.role === "Admin" && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Button
              variant="outlined"
              onClick={() => navigate(`/product/update/${product.id}`)}
            >
              Update product
            </Button>
            <DeleteProduct id={product.id} />
          </Box>
        )}
      </Box>

      <Grid container spacing={{ xs: 4, md: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              aspectRatio: "1 / 1",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
            }}
          >
            {product.imageUrl ? (
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name ?? "Product"}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  p: 2,
                }}
              />
            ) : (
              <Typography color="text.secondary">No image</Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontSize: { xs: "2rem", md: "3rem" },
                wordBreak: "break-word",
              }}
            >
              {product.name}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {hasPrice ? `$${Number(product.price).toFixed(2)}` : "—"}
            </Typography>

            <Divider />

            <Typography
              sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: 560 }}
            >
              {product.description || "No description available."}
            </Typography>

            {quantity === 0 ? (
              <Button
                variant="contained"
                size="large"
                sx={{ mt: 2, alignSelf: "flex-start", px: 5 }}
                onClick={() => addToBasket(product.id, 1)}
              >
                Add to basket
              </Button>
            ) : (
              <Box
                sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <IconButton
                    onClick={() => setQuantity(product.id, quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <RemoveIcon />
                  </IconButton>

                  <Typography sx={{ minWidth: 40, textAlign: "center" }}>
                    {quantity}
                  </Typography>

                  <IconButton
                    onClick={() => setQuantity(product.id, quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <IconButton
                  color="error"
                  onClick={() => removeFromBasket(product.id)}
                  aria-label="Remove from basket"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
