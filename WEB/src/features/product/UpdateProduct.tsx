import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useGetProductById,
} from "../../lib/hooks/useProduct";
import { useUpdateProduct } from "../../lib/hooks/useAdmin";
type FormValues = {
  name: string;
  description: string;
  price: number;
};

export default function UpdateProduct() {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useGetProductById(id!);
  const update = useUpdateProduct();

  // New image the user picked (the current one comes from the product)
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    values: product && {
      name: product.name ?? "",
      description: product.description ?? "",
      price: Number(product.price) || 0,
    },
  });

  const pickImage = (newFile: File | null) => {
    setFile(newFile);
    setPreview(newFile ? URL.createObjectURL(newFile) : null);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (values: FormValues) => {
    update.mutate(
      {
        id: product!.id,
        name: values.name.trim(),
        description: values.description.trim() || null,
        price: String(values.price),
        isActive: product!.isActive,
        image: file,
      },
      { onSuccess: () => pickImage(null) },
    );
  };

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info" variant="outlined">
          Product not found.
        </Alert>
      </Container>
    );
  }

  const images = [
    { label: "Current image", src: product.imageUrl },
    { label: "New image", src: preview },
  ].filter((img) => img.src);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Update product
      </Typography>

      <Paper
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 4, border: 1, borderColor: "divider" }}
      >
        <Stack spacing={3}>
          <TextField
            label="Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", { required: "Name is required" })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            {...register("description")}
          />

          <TextField
            label="Price"
            type="number"
            fullWidth
            slotProps={{ htmlInput: { step: "0.01", min: 0 } }}
            error={!!errors.price}
            helperText={errors.price?.message}
            {...register("price", {
              valueAsNumber: true,
              min: { value: 0.01, message: "Price must be greater than 0" },
            })}
          />

          <Box>
            {images.length > 0 && (
              <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                {images.map((img) => (
                  <Box key={img.label} sx={{ width: 120 }}>
                    <Typography variant="caption" color="text.secondary">
                      {img.label}
                    </Typography>
                    <Box
                      component="img"
                      src={img.src!}
                      alt={img.label}
                      sx={{
                        display: "block",
                        width: "100%",
                        aspectRatio: "1 / 1",
                        objectFit: "cover",
                        mt: 1,
                        border: 1,
                        borderColor: "divider",
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            )}

            <Stack direction="row" spacing={2}>
              <Button component="label" variant="outlined" color="inherit">
                {images.length > 0 ? "Change image" : "Choose image"}
                <input
                  hidden
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => {
                    pickImage(e.target.files?.[0] ?? null);
                    e.target.value = "";
                  }}
                />
              </Button>

              {file && (
                <Button color="inherit" onClick={() => pickImage(null)}>
                  Undo change
                </Button>
              )}
            </Stack>
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={update.isPending}
          >
            {update.isPending ? "Saving changes" : "Save changes"}
          </Button>
          {update.isError && (
            <Alert severity="error">{update.error.message}</Alert>
          )}
          {update.isSuccess && (
            <Alert severity="success">
              {typeof update.data === "string"
                ? update.data
                : "Product updated"}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
