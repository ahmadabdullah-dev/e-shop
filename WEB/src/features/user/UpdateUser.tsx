import type { UpdateUserDto } from "../../lib/types/user";
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
import { useCurrentUser, useUpdateCurrentUser } from "../../lib/hooks/useUser";
import { useEffect, useState } from "react";

type UpdateUserForm = Pick<UpdateUserDto, "firstName" | "lastName">;

export default function UpdateUser() {
  const { data: user, isLoading } = useCurrentUser();
  const update = useUpdateCurrentUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserForm>({
    values: user && {
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
    },
  });

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const pickImage = (newFile: File | null) => {
    setFile(newFile);
    setPreview(newFile ? URL.createObjectURL(newFile) : null);
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (values: UpdateUserForm) => {
    update.mutate(
      {
        firstName: values.firstName?.trim() ?? "",
        lastName: values.lastName?.trim() ?? "",
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

  if (!user) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Alert severity="info" variant="outlined">
          User not found.
        </Alert>
      </Container>
    );
  }

  const images = [
    { label: "Current image", src: user.imageUrl },
    { label: "New image", src: preview },
  ].filter((img) => img.src);

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Update user
      </Typography>

      <Paper
        component="form"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 4, border: 1, borderColor: "divider" }}
      >
        <Stack spacing={3}>
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

          <TextField
            label="First name"
            fullWidth
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            {...register("firstName", { required: "First name is required" })}
          />

          <TextField
            label="Last name"
            fullWidth
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            {...register("lastName", { required: "Last name is required" })}
          />

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
              {typeof update.data === "string" ? update.data : "User updated"}
            </Alert>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
