import type { ReactNode } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Link as RouterLink } from "react-router";
import { useCurrentUser } from "../../lib/hooks/useUser";
import LogoutButton from "../auth/LogoutButton";

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
  email?: string | null,
) {
  const fromName = [firstName, lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join("");
  return (fromName || email?.[0] || "?").toUpperCase();
}

function ProfileShell({ children }: { children: ReactNode }) {
  return (
    <Container maxWidth="sm" sx={{ py: { xs: 3, sm: 6 } }}>
      {children}
    </Container>
  );
}

function ProfileField({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value?: string | null;
}) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: "center", py: 2 }}>
      <Box sx={{ display: "flex", color: "text.secondary" }}>{icon}</Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography noWrap sx={{ fontWeight: 500 }}>
          {value || "Not provided"}
        </Typography>
      </Box>
    </Stack>
  );
}

function ProfileSkeleton() {
  return (
    <ProfileShell>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Skeleton variant="circular" width={72} height={72} />
          <Skeleton variant="text" width={160} height={32} />
        </Stack>
        <Skeleton variant="rounded" height={120} sx={{ mt: 3 }} />
      </Paper>
    </ProfileShell>
  );
}

export default function MyProfile() {
  const user = useCurrentUser();

  if (user.isLoading) return <ProfileSkeleton />;

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

  return (
    <ProfileShell>
      <Paper variant="outlined" sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            src={data.imageUrl ?? undefined}
            alt={fullName || data.email}
            sx={{
              width: 72,
              height: 72,
              fontSize: 28,
              fontWeight: 600,
              bgcolor: "primary.main",
            }}
          >
            {getInitials(data.firstName, data.lastName, data.email)}
          </Avatar>

          <Typography
            variant="h5"
            component="h1"
            noWrap
            sx={{ flex: 1, minWidth: 0, fontWeight: 700 }}
          >
            {fullName || "Your profile"}
          </Typography>

          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
            <Tooltip title="Settings">
              <IconButton
                component={RouterLink}
                to="/user/settings"
                aria-label="Settings"
              >
                <SettingsOutlinedIcon />
              </IconButton>
            </Tooltip>
            <LogoutButton />
          </Stack>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack divider={<Divider flexItem />}>
          <ProfileField
            icon={<PersonOutlineIcon />}
            label="Full name"
            value={fullName}
          />
          <ProfileField
            icon={<EmailOutlinedIcon />}
            label="Email"
            value={data.email}
          />
        </Stack>
      </Paper>
    </ProfileShell>
  );
}
