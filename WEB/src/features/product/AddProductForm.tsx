import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { useAddProduct } from "../../lib/hooks/useAdmin";
import type { AddProductDto } from "../../lib/types/product";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; 
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];


type Feedback = { severity: "success" | "error"; message: string };

const defaultValues: AddProductDto = {
  name: "",
  description: "",
  price: 0,
  image: null,
};

export default function AddProductForm() {
  const { mutate, isPending } = useAddProduct();
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddProductDto>({ defaultValues });

  const updatePreview = (file: File | null) =>
    setPreview(file ? URL.createObjectURL(file) : null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (values: AddProductDto) => {
    setFeedback(null);

    mutate(
      {
        name: values.name.trim(),
        description: values.description?.trim() || undefined,
        price: values.price,
        image: values.image ?? undefined, 
      },
      {
        onSuccess: (data) => {
          setFeedback({
            severity: "success",
            message:  typeof data === "string" || typeof data === "number" ? ` ${data})` : "Product added",
          });
          reset(defaultValues);
          updatePreview(null);
        },
        onError: (error) =>
          setFeedback({
            severity: "error",
            message: error.message || "Could not add product",
          }),
      },
    );
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Add product
      </Typography>

      <Paper
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 4, border: 1, borderColor: "divider" }}
      >
        <Stack spacing={3}>
          {feedback && (
            <Alert
              severity={feedback.severity}
              onClose={() => setFeedback(null)}
            >
              {feedback.message}
            </Alert>
          )}

          <TextField
            label="Name"
            fullWidth
            error={!!errors.name}
            helperText={errors.name?.message}
            {...register("name", {
              required: "Name is required",
              minLength: { value: 2, message: "Use at least 2 characters" },
              maxLength: { value: 150, message: "Use 150 characters or fewer" },
            })}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            minRows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            {...register("description", {
              maxLength: {
                value: 2000,
                message: "Use 2000 characters or fewer",
              },
            })}
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
              max: { value: 1_000_000, message: "Price is too high" },
            })}
          />

          <Controller
            name="image"
            control={control}
            rules={{
              validate: (file) => {
                if (!file) return true; // optional
                if (!ALLOWED_TYPES.includes(file.type))
                  return "Use a JPG, PNG or WEBP image";
                if (file.size > MAX_IMAGE_SIZE)
                  return "Image must be 5 MB or smaller";
                return true;
              },
            }}
            render={({ field: { onChange }, fieldState }) => (
              <Box>
                {preview && (
                  <Box
                    component="img"
                    src={preview}
                    alt="Selected product"
                    sx={{
                      display: "block",
                      width: "100%",
                      maxHeight: 240,
                      objectFit: "contain",
                      mb: 2,
                      border: 1,
                      borderColor: "divider",
                    }}
                  />
                )}

                <Stack direction="row" spacing={2}>
                  <Button component="label" variant="outlined" color="inherit">
                    {preview ? "Change image" : "Choose image"}
                    <input
                      hidden
                      type="file"
                      accept={ALLOWED_TYPES.join(",")}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null;
                        onChange(file);
                        updatePreview(file);
                        e.target.value = ""; // allows picking the same file again
                      }}
                    />
                  </Button>

                  {preview && (
                    <Button
                      color="inherit"
                      onClick={() => {
                        onChange(null);
                        updatePreview(null);
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Stack>

                <Typography
                  variant="caption"
                  color={fieldState.error ? "error" : "text.secondary"}
                  sx={{ display: "block", mt: 1 }}
                >
                  {fieldState.error?.message ??
                    "Optional. JPG, PNG or WEBP, up to 5 MB."}
                </Typography>
              </Box>
            )}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isPending}
            startIcon={
              isPending ? <CircularProgress size={18} color="inherit" /> : null
            }
          >
            {isPending ? "Adding product" : "Add product"}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}
