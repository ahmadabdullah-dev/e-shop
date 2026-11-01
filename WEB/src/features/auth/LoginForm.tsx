import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
  Button,
  Alert,
  FormControlLabel,
  Link,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router";
import type { LoginDto } from "../../lib/types/auth";
import { useLoginUser } from "../../lib/hooks/useAuth";

export default function LoginForm() {
  const loginAsync = useLoginUser();
  const {
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<LoginDto>({
    defaultValues: { email: "", password: "", rememberMe: false },
  });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (creds: LoginDto) => {
    loginAsync.mutateAsync(creds, {
      onSuccess: () => {
        reset();
      },
      onError: () => {
        resetField("password");
      },
    });
  };
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper sx={{ p: 4, width: "100%" }}>
          <Typography variant="h3" sx={{ m: 2, textAlign: "center" }}>
            Login
          </Typography>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                {...register("email", { required: "Email is required" })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <FormControlLabel
                control={<Checkbox {...register("rememberMe")} />}
                label="Remember me"
              />
              <Link
                component="button"
                type="button"
                variant="body2"
                onClick={() => navigate("/forget-password")}
              >
                Forgot password?
              </Link>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loginAsync.isPending}
              >
                {loginAsync.isPending ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Login"
                )}
              </Button>
              {loginAsync.error && (
                <Alert severity="error">{loginAsync.error.message}</Alert>
              )}
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/register")}
              >
                Don't have an account
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
