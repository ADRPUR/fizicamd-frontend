import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  Link,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { API_URL } from "../api/http";
import { useI18n } from "../i18n";
import LanguageSelector from "../components/LanguageSelector";
import { fetchVisitCount } from "../api/public";

const layoutBackground =
  "radial-gradient(circle at 10% 20%, rgba(91,92,255,0.15), transparent 55%),radial-gradient(circle at 90% 10%, rgba(255,126,92,0.15), transparent 55%),linear-gradient(180deg, #F8F9FF 0%, #FBF5FF 100%)";

function AvatarMenu() {
  const { user, logout } = useAuthStore();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) {
    return (
      <Stack direction="row" spacing={1}>
        <Button color="inherit" onClick={() => navigate("/login")}>
          {t("login.title")}
        </Button>
        <Button variant="contained" onClick={() => navigate("/register")}>
          {t("register.title")}
        </Button>
      </Stack>
    );
  }

  const initials = `${user.profile?.firstName?.[0] ?? ""}${user.profile?.lastName?.[0] ?? ""}` || user.email[0];

  const menuItems = [
    { label: t("layout.home"), to: "/" },
    ...(user.role === "ADMIN" ? [{ label: t("layout.overview"), to: "/overview" }] : []),
    { label: t("layout.profile"), to: "/profile" },
    ...(user.role === "TEACHER" || user.role === "ADMIN"
      ? [{ label: t("layout.studio"), to: "/teacher/studio" }]
      : []),
    ...(user.role === "ADMIN"
      ? [
          { label: t("layout.users"), to: "/admin/users" },
          { label: t("layout.resources"), to: "/admin/resources" },
        ]
      : user.role === "TEACHER"
      ? [{ label: t("layout.resources"), to: "/admin/resources" }]
      : []),
  ];

  return (
    <>
      <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Avatar
          src={user.profile?.avatarUrl ? `${API_URL}${user.profile.avatarUrl}?t=${Date.now()}` : undefined}
          sx={{ bgcolor: "secondary.main", width: 36, height: 36 }}
        >
          {initials}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        {menuItems.map((item) => (
          <MenuItem
            key={item.to}
            onClick={() => {
              navigate(item.to);
              setAnchorEl(null);
            }}
          >
            {item.label}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            logout();
            setAnchorEl(null);
            navigate("/");
          }}
        >
          {t("layout.profileMenu.logout")}
        </MenuItem>
      </Menu>
    </>
  );
}

export default function MainLayout() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const currentYear = new Date().getFullYear();
  const [visitCount, setVisitCount] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  const { user } = useAuthStore();

  const quickLinks = [
    { label: t("layout.home"), path: "/" },
    { label: t("resources.listTitle"), path: "/resources" },
    { label: t("home.searchAction"), path: "/search" },
    ...(user && (user.role === "TEACHER" || user.role === "ADMIN")
      ? [{ label: t("layout.studio"), path: "/teacher/studio" }]
      : []),
  ];

  useEffect(() => {
    fetchVisitCount()
      .then((data) => setVisitCount(data.total))
      .catch(() => undefined);
  }, []);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: layoutBackground }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          background: "transparent",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(15,23,42,0.06)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              py: { xs: 1.25, md: 2 },
              justifyContent: "space-between",
              gap: { xs: 1, md: 2 },
            }}
          >
            <Stack
              direction="row"
              spacing={{ xs: 1, md: 2 }}
              alignItems="center"
              sx={{ minWidth: 0, flex: 1 }}
            >
              {isMobile && !isAuthPage && (
                <IconButton
                  onClick={() => setMobileOpen(true)}
                  aria-label={t("layout.sidebar")}
                  sx={{ ml: -0.5 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <Box
                onClick={() => navigate("/")}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  component="img"
                  src="/physics_hub_atom.svg"
                  alt="Physics Hub"
                  sx={{ width: { xs: 34, md: 42 }, height: { xs: 34, md: 42 }, display: "block" }}
                />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography variant="h6" fontWeight={700}>
                    Physics Hub
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {t("common.platformTitle")}
                  </Typography>
                </Box>
              </Box>
              {!isAuthPage && !isMobile && (
                <Stack direction={{ xs: "column", md: "row" }} spacing={1} sx={{ ml: { md: 4 } }}>
                  {quickLinks.map((link) => (
                    <Button
                      key={link.path}
                      variant="text"
                      color="inherit"
                      onClick={() => navigate(link.path)}
                      sx={{ color: "text.secondary" }}
                    >
                      {link.label}
                    </Button>
                  ))}
                </Stack>
              )}
            </Stack>
            <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center" sx={{ flexShrink: 0 }}>
              <LanguageSelector />
              <AvatarMenu />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      {!isAuthPage && (
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          PaperProps={{ sx: { width: 260, p: 2 } }}
        >
          <Stack spacing={2}>
            <Box
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 1 }}
            >
              <Box component="img" src="/physics_hub_atom.svg" alt="Physics Hub" sx={{ width: 32, height: 32 }} />
              <Typography variant="subtitle1" fontWeight={700}>
                Physics Hub
              </Typography>
            </Box>
            <List sx={{ p: 0 }}>
              {quickLinks.map((link) => (
                <ListItemButton
                  key={link.path}
                  onClick={() => {
                    navigate(link.path);
                    setMobileOpen(false);
                  }}
                  selected={location.pathname === link.path}
                  sx={{ borderRadius: 2, mb: 0.5 }}
                >
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))}
            </List>
          </Stack>
        </Drawer>
      )}

      <Box component="main" flex={1} py={isAuthPage ? 4 : 6}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>

      <Box
        component="footer"
        sx={{
          borderTop: "1px solid rgba(15,23,42,0.08)",
          py: 3,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1}
            alignItems={{ xs: "center", md: "center" }}
            justifyContent="space-between"
            textAlign={{ xs: "center", md: "left" }}
          >
            <Typography variant="body2" color="text.secondary">
              Physics Hub • {currentYear} • {t("footer.visitors")}{" "}
              {visitCount !== null ? visitCount.toLocaleString() : "—"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("footer.dedication")}{" "}
              <Link
                href="https://www.linkedin.com/in/adrian-purice-18047584"
                target="_blank"
                rel="noreferrer"
                underline="hover"
              >
                Adrian Purice
              </Link>
              .
            </Typography>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
