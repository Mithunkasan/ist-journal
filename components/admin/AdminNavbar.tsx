"use client";

import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
  Badge,
} from "@mui/material";
import {
  Notifications,
  Settings,
  Logout,
  Menu as MenuIcon,
  Language as LanguageIcon,
} from "@mui/icons-material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useSession, signOut } from "next-auth/react";
import { useLanguage } from "@/lib/LanguageContext";

interface AdminNavbarProps {
  /** Called when the hamburger button is pressed (mobile only) */
  onMenuClick?: () => void;
}

const AdminNavbar = ({ onMenuClick }: AdminNavbarProps) => {
  const { data: session } = useSession();
  const { lang, setLang, t } = useLanguage();

  const userRole = session?.user?.role;
  let portalTitle = "IST PORTAL";
  let portalHref = "/";

  switch (userRole) {
    case "ADMIN":
      portalTitle = "IST ADMIN PORTAL";
      portalHref = "/admin/dashboard";
      break;
    case "EDITOR":
      portalTitle = "IST EDITOR PORTAL";
      portalHref = "/editor";
      break;
    case "ASSOCIATE_EDITOR":
      portalTitle = "IST ASSOCIATE EDITOR PORTAL";
      portalHref = "/associate-editor/dashboard";
      break;
    case "REVIEWER":
      portalTitle = "IST REVIEWER PORTAL";
      portalHref = "/reviewer";
      break;
    case "AUTHOR":
      portalTitle = "IST AUTHOR PORTAL";
      portalHref = "/author";
      break;
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] =
    React.useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = React.useState<
    Array<{
      id: string;
      title: string;
      message: string;
      isRead: boolean;
      createdAt: string;
    }>
  >([]);

  const fetchNotifications = React.useCallback(async () => {
    if (!session?.user?.id) {
      return;
    }

    const response = await fetch("/api/notifications");
    if (response.ok) {
      setNotifications(await response.json());
    }
  }, [session?.user?.id]);

  React.useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const unreadNotificationCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const handleOpenNotifications = async (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setNotificationAnchorEl(event.currentTarget);
    await fetchNotifications();
    if (unreadNotificationCount > 0) {
      await fetch("/api/notifications", { method: "PATCH" });
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    }
  };

  const handleCloseNotifications = () => {
    setNotificationAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        bgcolor: "#fff",
        color: "#004b23",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* ── Left: hamburger (mobile) + logo ─────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Hamburger — only visible on xs/sm */}
          {onMenuClick && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label={lang === "en" ? "Open navigation menu" : "فتح قائمة التنقل"}
              onClick={onMenuClick}
              sx={{ display: { xs: "flex", md: "none" }, mr: 0.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <MenuBookOutlinedIcon sx={{ mr: 1, fontSize: 30 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href={portalHref}
            sx={{
              fontWeight: 800,
              letterSpacing: "-0.5px",
              color: "inherit",
              textDecoration: "none",
              display: { xs: "none", sm: "block" },
            }}
          >
            {portalTitle}
          </Typography>
        </Box>

        {/* ── Right: language toggle + notifications + avatar ────────────── */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            onClick={toggleLang}
            variant="outlined"
            size="small"
            startIcon={<LanguageIcon sx={{ ml: lang === "ar" ? 1 : 0, mr: lang === "en" ? 1 : 0 }} />}
            sx={{
              borderColor: "#004b23",
              color: "#004b23",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              '&:hover': {
                bgcolor: "#004b23",
                color: "#fff",
                borderColor: "#004b23",
              }
            }}
          >
            {lang === "en" ? "العربية" : "English"}
          </Button>

          <Tooltip title={lang === "en" ? "Notifications" : "الإشعارات"}>
            <IconButton
              color="inherit"
              aria-label={lang === "en" ? "Notifications" : "الإشعارات"}
              onClick={handleOpenNotifications}
            >
              <Badge badgeContent={unreadNotificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            anchorEl={notificationAnchorEl}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            open={Boolean(notificationAnchorEl)}
            onClose={handleCloseNotifications}
            PaperProps={{ sx: { width: 360, maxWidth: "90vw" } }}
          >
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                Notifications
              </Typography>
            </Box>
            <Divider />
            {notifications.length === 0 ? (
              <MenuItem disabled>No notifications</MenuItem>
            ) : (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={handleCloseNotifications}
                  sx={{ alignItems: "flex-start", whiteSpace: "normal" }}
                >
                  <ListItemText
                    primary={notification.title}
                    secondary={notification.message}
                    primaryTypographyProps={{ fontWeight: 700 }}
                    secondaryTypographyProps={{
                      sx: {
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      },
                    }}
                  />
                </MenuItem>
              ))
            )}
          </Menu>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={lang === "en" ? "Open settings" : "فتح الإعدادات"}>
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0 }}
                aria-label="User menu"
              >
                <Avatar sx={{ bgcolor: "#004b23" }}>
                  {session?.user?.name?.charAt(0) || "A"}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              open={Boolean(anchorEl)}
              onClose={handleCloseUserMenu}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {session?.user?.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {session?.user?.email}
                </Typography>
              </Box>
              <Divider />
              <MenuItem onClick={handleCloseUserMenu}>
                <ListItemIcon>
                  <Settings fontSize="small" />
                </ListItemIcon>
                {t("sb.myprofile")}
              </MenuItem>
              <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                <ListItemIcon>
                  <Logout fontSize="small" sx={{ color: "#d32f2f" }} />
                </ListItemIcon>
                <Typography color="error">{t("sb.logout")}</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminNavbar;
