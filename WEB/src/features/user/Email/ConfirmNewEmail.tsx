import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import {
  useUpdateCurrentEmail,
  useResendCurrentEmailConfirmationCode,
} from "../../../lib/hooks/useUser";

type Props = { sentTo: string; onChangeEmail: () => void };
type CodeForm = { code: string };

export default function ConfirmNewEmail({ sentTo, onChangeEmail }: Props) {
  const confirm = useUpdateCurrentEmail();
  const resend = useResendCurrentEmailConfirmationCode();
  const [cooldown, setCooldown] = useState(30);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors },
  } = useForm<CodeForm>({ defaultValues: { code: "" } });

  // Resend cooldown countdown
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const onSubmit = (data: CodeForm) =>
    confirm.mutate(data, { onError: () => resetField("code") });

  const onResend = () =>
    resend.mutate(undefined, { onSuccess: () => setCooldown(30) });

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2.5}>
        <Typography variant="h5" sx={{fontWeight:700}}>
          Confirm Your Email
        </Typography>
        <Typography color="text.secondary">
          We sent a confirmation code to <b>{sentTo}</b>
        </Typography>

        <TextField
          label="Confirmation Code"
          placeholder="Enter the 6-digit code"
          disabled={confirm.isSuccess}
          {...register("code", {
            required: "Code is required",
            pattern: { value: /^\d{6}$/, message: "Code must be 6 digits" },
          })}
          error={!!errors.code}
          helperText={errors.code?.message}
        />

        <Button
          type="submit"
          variant="contained"
          disabled={confirm.isPending || confirm.isSuccess}
        >
          {confirm.isPending ? "Confirming..." : "Confirm Email"}
        </Button>

        {confirm.error && (
          <Alert severity="error">{confirm.error.message}</Alert>
        )}
        {confirm.isSuccess && (
          <Alert severity="success">{confirm.data}</Alert>
        )}

        <Button
          variant="outlined"
          disabled={resend.isPending || cooldown > 0 || confirm.isSuccess}
          onClick={onResend}
        >
          {cooldown > 0
            ? `Resend available in ${cooldown}s`
            : "Resend Confirmation Code"}
        </Button>

        {resend.isSuccess && (
          <Alert severity="success">{resend.data || "Code sent."}</Alert>
        )}
        {resend.isError && (
          <Alert severity="error">
            Failed to resend code. Please try again.
          </Alert>
        )}

        <Button onClick={onChangeEmail} disabled={confirm.isSuccess}>
          Use a different email
        </Button>
      </Stack>
    </Box>
  );
}
