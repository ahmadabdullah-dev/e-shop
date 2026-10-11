import type { ReactNode } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import { useCurrentUser } from "../../lib/hooks/useUser";
import LogoutButton from "../auth/LogoutButton";
import { Link as RouterLink } from "react-router";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

interface ProfileFieldProps {
  icon: ReactNode;
  label: string;
  value?: string | number | null;
}

function ProfileField({ icon, label, value }: ProfileFieldProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center", py: 2 }}>
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "action.hover",
          color: "text.secondary",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1" noWrap sx={{ fontWeight: 500 }}>
          {value || "Not provided"}
        </Typography>
      </Box>
    </Stack>
  );
}

function ProfileShell({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      {children}
    </Container>
  );
}

function ProfileSkeleton() {
  return (
    <ProfileShell>
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack spacing={2} sx={{ alignItems: "center", mb: 3 }}>
          <Skeleton variant="circular" width={88} height={88} />
          <Skeleton variant="text" width={160} height={32} />
        </Stack>
        <Skeleton variant="rounded" height={56} />
      </Paper>
    </ProfileShell>
  );
}

export default function MyProfile() {
  const user = useCurrentUser();
  if (user.isLoading) {
    return <ProfileSkeleton />;
  }

  if (user.isError) {
    return (
      <ProfileShell>
        <Alert
          severity="error"
          variant="outlined"
          action={
            <Button color="inherit" size="small" onClick={() => user.refetch()}>
              Retry
            </Button>
          }
        >
          Failed to load your profile.
        </Alert>
      </ProfileShell>
    );
  }

  const data = user.data;

  if (!data) {
    return (
      <ProfileShell>
        <Alert severity="info" variant="outlined">
          No profile data found.
        </Alert>
      </ProfileShell>
    );
  }

  const fullName = [data.firstName, data.lastName].filter(Boolean).join(" ");
  const initials =
    [data.firstName, data.lastName]
      .filter(Boolean)
      .map((n) => n![0])
      .join("")
      .toUpperCase() ||
    data.email?.[0]?.toUpperCase() ||
    "?";

  return (
    <ProfileShell>
      <Paper
        sx={{
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            height: 96,
            bgcolor: "primary.main",
            opacity: 0.9,
          }}
        />

        <Box sx={{ px: { xs: 3, sm: 4 }, pb: { xs: 3, sm: 4 } }}>
          <Stack
            direction="row"
            sx={{
              alignItems: "flex-end",
              justifyContent: "space-between",
            }}
          >
            <Avatar
              src={data.imageUrl ?? undefined}
              alt={fullName || data.email}
              sx={{
                width: 96,
                height: 96,
                fontSize: 36,
                fontWeight: 700,
                bgcolor: "background.paper",
                color: "primary.main",
                border: "4px solid",
                borderColor: "background.paper",
                boxShadow: 1,
              }}
            >
              {initials}
            </Avatar>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Button
                component={RouterLink}
                to="/settings"
                variant="outlined"
                startIcon={<SettingsOutlinedIcon />}
                sx={{ px: 0 }}
              ></Button>
              <LogoutButton />
            </Stack>
          </Stack>

          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {fullName || "Your profile"}
          </Typography>
          {data.email && (
            <Typography variant="body2" color="text.secondary">
              {data.email}
            </Typography>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="subtitle2" color="text.secondary">
            Account details
          </Typography>

          <Stack divider={<Divider flexItem />}>
            <ProfileField
              icon={<PersonOutlineIcon fontSize="small" />}
              label="Full name"
              value={fullName}
            />
            <ProfileField
              icon={<EmailOutlinedIcon fontSize="small" />}
              label="Email"
              value={data.email}
            />
          </Stack>
        </Box>
      </Paper>
    </ProfileShell>
  );
}
