import { useState, type ReactNode } from "react";
import {
  Box,
  Button,
  Chip,
  Container,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { Link } from "react-router";

type Feature = { title: string; description: string; icon: ReactNode };

const features: Feature[] = [
  {
    title: "Products",
    description:
      "Browse the catalog, and manage products with full create, read, update and delete. Orders are tracked end to end.",
    icon: <Inventory2OutlinedIcon />,
  },
  {
    title: "Authentication",
    description:
      "Register, log in, log out, confirm your email and reset a forgotten password, all built on ASP.NET Identity.",
    icon: <LockOutlinedIcon />,
  },
  {
    title: "Basket",
    description:
      "Add, remove and update items in your basket. The basket is handled entirely on the client.",
    icon: <ShoppingBasketOutlinedIcon />,
  },
];

const stack = [
  "React",
  "TypeScript",
  "MUI",
  "React Router",
  "ASP.NET Identity",
  "SQL",
  "Entity Framework",
  "ASP.NET Web API",
  "C#"
];

const accounts = [
  { role: "Admin", email: "admin@test.com", password: "Pa$$w0rd" },
  { role: "Customer", email: "customer@test.com", password: "Pa$$w0rd" },
];

function CopyValue({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (e.g. insecure context); ignore.
    }
  };

  return (
    <Stack direction="row" sx={{ alignItems: "center", minWidth: 0 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ width: 80, flexShrink: 0 }}
      >
        {label}
      </Typography>
      <Typography
        sx={{ fontFamily: "monospace", fontWeight: 600, flex: 1, minWidth: 0 }}
        noWrap
      >
        {value}
      </Typography>
      <Tooltip title={copied ? "Copied" : `Copy ${label.toLowerCase()}`}>
        <IconButton
          size="small"
          onClick={handleCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          {copied ? (
            <CheckIcon fontSize="small" color="success" />
          ) : (
            <ContentCopyIcon fontSize="small" />
          )}
        </IconButton>
      </Tooltip>
    </Stack>
  );
}

export default function LandingPage() {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
      {/* Hero */}
      <Stack spacing={3} component="main">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            fontSize: { xs: "2.25rem", md: "3.5rem" },
          }}
        >
          A full-stack e-shop, built from scratch
        </Typography>

        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ maxWidth: 600, fontWeight: 400, lineHeight: 1.6 }}
        >
          Ahmad Abdullah's portfolio project: a working store with products,
          orders, a basket and secure sign-in. Explore it with the test accounts
          below.
        </Typography>

        <Stack
          direction="row"
          useFlexGap
          sx={{ flexWrap: "wrap", gap: 1 }}
          aria-label="Technologies used"
        >
          {stack.map((tech) => (
            <Chip key={tech} label={tech} variant="outlined" size="small" />
          ))}
        </Stack>

        <Box>
          <Button
            variant="contained"
            size="large"
            component={Link}
            to="/products"
          >
            Browse products
          </Button>
        </Box>
      </Stack>

      {/* Features */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={4}
        sx={{ mt: { xs: 7, md: 10 } }}
        component="section"
        aria-label="Features"
      >
        {features.map((feature) => (
          <Stack key={feature.title} spacing={1.5} sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", color: "primary.main" }}>
              {feature.icon}
            </Box>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
              {feature.title}
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
              {feature.description}
            </Typography>
          </Stack>
        ))}
      </Stack>

      {/* Test accounts */}
      <Paper
        variant="outlined"
        component="section"
        aria-labelledby="test-accounts-heading"
        sx={{ mt: { xs: 7, md: 10 }, p: { xs: 2.5, sm: 4 } }}
      >
        <Typography
          id="test-accounts-heading"
          variant="h6"
          component="h2"
          sx={{ fontWeight: 600 }}
        >
          Try it with a test account
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5, mb: 3 }}>
          Sign in as an admin to manage products, or as a customer to shop.
        </Typography>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 3, sm: 4 }}
        >
          {accounts.map((account) => (
            <Stack
              key={account.role}
              spacing={0.5}
              sx={{ flex: 1, minWidth: 0 }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {account.role}
              </Typography>
              <CopyValue label="Email" value={account.email} />
              <CopyValue label="Password" value={account.password} />
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Container>
  );
}
