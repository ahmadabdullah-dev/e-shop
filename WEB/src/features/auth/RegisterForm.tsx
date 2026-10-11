import { useEffect, useState } from "react";
import type { RegisterDto } from "../../lib/types/auth";
import {
  Container,
  CircularProgress,
  Alert,
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Stack,
  Grid,
  Divider,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Controller, useForm } from "react-hook-form";
import { useRegisterUser } from "../../lib/hooks/useAuth";
import { useNavigate } from "react-router";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function RegisterForm() {
  const registerUser = useRegisterUser();
  const {
    register,
    handleSubmit,
    reset,
    control,
    resetField,
    formState: { errors },
  } = useForm<RegisterDto>();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [preview, setPreview] = useState<string | null>(null);

  const updatePreview = (file: File | null) =>
    setPreview(file ? URL.createObjectURL(file) : null);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = (creds: RegisterDto) => {
    registerUser.mutate(creds, {
      onSuccess: () => {
        reset();
        updatePreview(null);
      },
      onError: () => {
        resetField("Password");
      },
    });
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100dvh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Paper
          sx={{
            p: { xs: 3, sm: 5 },
            width: "100%",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Stack spacing={1} sx={{ mb: 4, alignItems: "center" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mt: 1 }}>
              Register
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2.5}>
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
                        alt="Profile picture preview"
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
                      <Button
                        component="label"
                        variant="outlined"
                        color="inherit"
                      >
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

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="First Name"
                    fullWidth
                    {...register("FirstName", {
                      required: "First name is required",
                    })}
                    error={!!errors.FirstName}
                    helperText={errors.FirstName?.message}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    label="Last Name"
                    fullWidth
                    {...register("LastName", {
                      required: "Last name is required",
                    })}
                    error={!!errors.LastName}
                    helperText={errors.LastName?.message}
                  />
                </Grid>
              </Grid>

              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("Email", { required: "Email is required" })}
                error={!!errors.Email}
                helperText={errors.Email?.message}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("Password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                })}
                error={!!errors.Password}
                helperText={errors.Password?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={registerUser.isPending}
              >
                {registerUser.isPending ? (
                  <CircularProgress size={22} color="inherit" />
                ) : (
                  "Register"
                )}
              </Button>

              {registerUser.isSuccess && (
                <Alert severity="success" variant="outlined">
                  {registerUser.data.data}
                </Alert>
              )}
              {registerUser.error && (
                <Alert severity="error" variant="outlined">
                  {registerUser.error.message}
                </Alert>
              )}

              <Divider>
                <Typography variant="caption" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/login")}
              >
                Already have an account? Sign In
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
