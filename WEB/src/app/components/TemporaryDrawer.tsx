import {
  Drawer,
  Box,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { useState, Fragment } from "react";
import { useNavigate } from "react-router";
import Footer from "./Footer";
import theme from "../../lib/theme";

export interface DrawerNavItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

export interface DrawerProps {
  items: DrawerNavItem[];
}

export default function TemporaryDrawer({ items }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const navigate = useNavigate();
  const toggleDrawer = (next: boolean) => () => setOpen(next);

  return (
    <>
      <IconButton
        onClick={toggleDrawer(true)}
        aria-label="Open menu"
        disableRipple
        sx={{
          color: "text.primary",
          borderRadius: 0,
          "&:hover": { backgroundColor: `${theme.palette.background.paper}` },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        slotProps={{
          paper: {
            sx: (theme) => ({
              width: { xs: "100%", sm: 420 },
              backgroundColor: "background.default",
              borderLeft: `1px solid ${theme.palette.divider}`,
            }),
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            fontFamily: (theme) => theme.typography.fontFamily,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 3,
              py: 2.5,
            }}
          >
            <Typography
              sx={{
                color: "text.primary",
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: "0.18em",
              }}
            >
              E Shop
            </Typography>
            <IconButton
              onClick={toggleDrawer(false)}
              aria-label="Close menu"
              disableRipple
              sx={{
                color: "text.primary",
                borderRadius: 0,
                "&:hover": {
                  backgroundColor: `${theme.palette.background.paper}`,
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider />
          <List sx={{ py: 0, flex: 1 }}>
            {items.map((item, i) => (
              <Fragment key={item.label}>
                <ListItemButton
                  disableRipple
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                  onClick={() => {
                    item.onClick?.();
                    if (item.href) navigate(item.href);
                    setOpen(false);
                  }}
                  sx={(theme) => ({
                    px: 3,
                    py: 2.75,
                    borderLeft: "2px solid transparent",
                    transition:
                      "border-color 150ms ease, padding-left 150ms ease, background-color 150ms ease",
                    ...(activeIndex === i && {
                      borderLeft: `2px solid ${theme.palette.secondary.main}`,
                      pl: 3.75,
                      backgroundColor: theme.palette.action.hover,
                    }),
                  })}
                >
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          color: "text.primary",
                          fontWeight: 600,
                          fontSize: 15,
                          letterSpacing: "0.12em",
                          textTransform: "uppercase",
                        },
                      },
                    }}
                  />
                </ListItemButton>
                {i < items.length - 1 && <Divider />}
              </Fragment>
            ))}
          </List>
        </Box>
        <Footer />
      </Drawer>
    </>
  );
}
