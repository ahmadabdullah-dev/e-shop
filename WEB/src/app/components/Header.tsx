import {
  AppBar,
  Toolbar,
  Stack,
  Avatar,
  Badge,
  IconButton,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import ShoppingBasketOutlinedIcon from "@mui/icons-material/ShoppingBasketOutlined";
import { Link as RouterLink } from "react-router";
import TemporaryDrawer from "./TemporaryDrawer";
import { useEffect, useState } from "react";
import AppLogoWithName from "./AppLogoWithName";
import { useCurrentUser } from "../../lib/hooks/useUser";
import { useBasket } from "../../lib/hooks/useBasket";

const NAV_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Basket", href: "/basket" },
  { label: "Orders", href: "/orders" },
  { label: "Admin", href: "/admin", adminOnly: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { data: user } = useCurrentUser();
  const { totalItems } = useBasket();
  const basketCount = totalItems ?? 0;

  const isAdmin = user?.role === "Admin"; 
  const visibleLinks = NAV_LINKS.filter((link) => !link.adminOnly || isAdmin);

  const userName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");
  const userImage = user?.imageUrl ?? undefined;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={(theme) => ({
        backgroundColor: scrolled
          ? `${theme.palette.background.paper}`
          : "transparent",
        backdropFilter: scrolled ? "blur(8px)" : "none",
        borderBottom: `1px solid ${scrolled ? theme.palette.divider : "transparent"}`,
        transition: "background-color 200ms ease, border-color 200ms ease",
        boxShadow: "none",
      })}
    >
      <Toolbar
        sx={{
          minHeight: { xs: 56, md: 64 },
          px: { xs: 2, md: 3 },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack
          component={RouterLink}
          to="/"
          direction="row"
          spacing={0.75}
          sx={{
            textDecoration: "none",
            userSelect: "none",
            alignItems: "center",
          }}
        >
          <AppLogoWithName />
        </Stack>

        {/* Desktop nav */}
        <Stack
          direction="row"
          spacing={4}
          sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
        >
          {visibleLinks.map((link) => {
            const isBasketLink = link.href === "/basket";

            return (
              <MuiLink
                key={link.label}
                component={RouterLink}
                to={link.href}
                underline="none"
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "text.primary",
                  fontWeight: 600,
                  fontSize: 12,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  position: "relative",
                  pb: 0.5,
                  "&:hover": { color: "text.primary" },
                  "&:hover::after": { width: "100%" },
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    width: 0,
                    height: "1px",
                    backgroundColor: (theme) => theme.palette.secondary.main,
                    transition: "width 150ms ease",
                  },
                }}
              >
                {isBasketLink && (
                  <Badge
                    badgeContent={basketCount}
                    color="secondary"
                    max={99}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 10,
                        height: 16,
                        minWidth: 16,
                        padding: "0 4px",
                      },
                    }}
                  >
                    <ShoppingBasketOutlinedIcon sx={{ fontSize: 20 }} />
                  </Badge>
                )}
                {link.label}
              </MuiLink>
            );
          })}

          {/* User avatar + name (desktop) */}
          {user && (
            <Stack
              component={RouterLink}
              to="/my-profile"
              direction="row"
              spacing={1}
              sx={{
                alignItems: "center",
                textDecoration: "none",
                color: "text.primary",
              }}
            >
              <Avatar
                src={userImage}
                alt={userName}
                sx={{ width: 32, height: 32 }}
              >
                {userName.charAt(0).toUpperCase()}
              </Avatar>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, maxWidth: 140 }}
                noWrap
              >
                {userName}
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* Mobile: basket + avatar + drawer */}
        <Stack
          direction="row"
          spacing={1}
          sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
        >
          <IconButton
            component={RouterLink}
            to="/basket"
            aria-label="Basket"
            size="small"
            sx={{ color: "text.primary" }}
          >
            <Badge badgeContent={basketCount} color="secondary" max={99}>
              <ShoppingBasketOutlinedIcon />
            </Badge>
          </IconButton>

          {user && (
            <Avatar
              component={RouterLink}
              to="/my-profile"
              src={userImage}
              alt={userName}
              sx={{ width: 32, height: 32 }}
            >
              {userName.charAt(0).toUpperCase()}
            </Avatar>
          )}
          <TemporaryDrawer items={visibleLinks} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
