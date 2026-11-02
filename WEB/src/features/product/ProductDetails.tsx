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
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useCurrentUser } from "../../lib/hooks/useUser";
import { useBasket } from "../../lib/hooks/useBasket";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material"; 
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import DeleteProduct from "./DeleteProduct";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: product, isLoading, error } = useGetProductById(id ?? "");
  const {data: currentUser} = useCurrentUser();
  const { addToBasket, setQuantity, removeFromBasket, getQuantity } = useBasket();

  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="error" variant="outlined">
          Invalid product link.
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
        <Alert severity="error" variant="outlined">
          Something went wrong while loading this product. Please try again.
        </Alert>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Alert severity="info" variant="outlined">
          Product not found.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Button
        onClick={() => navigate("/")}
        variant="text"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 4, px: 0, color: "text.secondary" }}
      >
        Go to products
      </Button>

      {currentUser?.role === "Admin" && (
        <Box sx={{ paddingBottom: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/product/update/${product.id}`)}
          >
            Update Product
          </Button>
            <DeleteProduct id={product.id} />
        </Box>
      )}
      <Grid container spacing={{ xs: 4, md: 8 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Box
            sx={{
              aspectRatio: "1 / 1",
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "divider",
              overflow: "hidden",
              display: "grid",
              placeItems: "center",
            }}
          >
            {product.imageUrl ? (
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.name ?? "Product"}
                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography color="text.secondary">No image</Typography>
            )}
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography variant="h3" component="h1">
              {product.name}
            </Typography>

            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {product.price ? `$${product.price}` : "—"}
            </Typography>

            <Divider />

            {product.description ? (
              <Typography
                sx={{ color: "text.secondary", lineHeight: 1.8, maxWidth: 560 }}
              >
                {product.description}
              </Typography>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>
                No description available.
              </Typography>
            )}
            {(() => {
              const quantity = getQuantity(product.id);

              if (quantity === 0) {
                return (
                  <Button
                    variant="contained"
                    size="large"
                    sx={{ mt: 2 }}
                    onClick={() => addToBasket(product.id, 1)}
                  >
                    Add to basket
                  </Button>
                );
              }

              return (
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
              );
            })()}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
