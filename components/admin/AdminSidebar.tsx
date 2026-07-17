"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Dashboard,
  People,
  Description,
  RateReview,
  Settings,
  Logout,
  PersonAdd,
  Assessment,
} from "@mui/icons-material";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
} from "@mui/material";
import { signOut } from "next-auth/react";
import MobileSidebarWrapper from "@/components/shared/MobileSidebarWrapper";

import { useLanguage } from "@/lib/LanguageContext";

const menuItems = [
  { textKey: "sb.dashboard", icon: <Dashboard />, href: "/admin/dashboard" },
  { textKey: "sb.users", icon: <People />, href: "/admin/dashboard/users" },
  { textKey: "sb.submissiontracking", icon: <Assessment />, href: "/admin/submission-tracking" },
  { textKey: "sb.submissions", icon: <Description />, href: "/admin/dashboard/submissions" },
  { textKey: "sb.reviews", icon: <RateReview />, href: "/admin/dashboard/reviews" },
  { textKey: "sb.settings", icon: <Settings />, href: "/admin/dashboard/settings" },
];

const roleMenuItems = [
  { textKey: "role.admin", icon: <PersonAdd />, href: "/admin/editorregister?role=admin" },
  { textKey: "role.editor", icon: <PersonAdd />, href: "/admin/editorregister?role=editor" },
  { textKey: "role.reviewer", icon: <PersonAdd />, href: "/admin/editorregister?role=reviewer" },
  { textKey: "role.user", icon: <PersonAdd />, href: "/admin/editorregister?role=user" },
];

const editorialMenuItems = [
  { textKey: "sb.registereditor", icon: <PersonAdd />, href: "/admin/editorregister?role=editor" },
  { textKey: "sb.registerreviewer", icon: <PersonAdd />, href: "/admin/editorregister?role=reviewer" },
];

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

const SidebarContent = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeRole = searchParams.get("role");
  const { t, dir } = useLanguage();
  return (
    <Box
      sx={{
        width: 280,
        height: "100%",
        bgcolor: "#fff",
        borderRight: dir === "ltr" ? "1px solid #e0e0e0" : "none",
        borderLeft: dir === "rtl" ? "1px solid #e0e0e0" : "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box sx={{ p: 2.5 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "#64748b", letterSpacing: 1.2 }}
        >
          {t("sb.adminmenu")}
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <ListItem key={item.textKey} disablePadding sx={{ mb: 1 }}>
              <Link
                href={item.href}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "#f0fdf4" : "transparent",
                    color: isActive ? "#004b23" : "#666",
                    "&:hover": { bgcolor: "#f0fdf4", color: "#004b23" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.textKey)}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 2.5, pt: 1 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "#64748b", letterSpacing: 1.2 }}
        >
          {t("sb.userroles")}
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {roleMenuItems.map((item) => {
          const itemRole = item.href.split("role=")[1];
          const isActive = pathname === "/admin/editorregister" && activeRole === itemRole;
          return (
            <ListItem key={item.textKey} disablePadding sx={{ mb: 1 }}>
              <Link
                href={item.href}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "#f0fdf4" : "transparent",
                    color: isActive ? "#004b23" : "#666",
                    "&:hover": { bgcolor: "#f0fdf4", color: "#004b23" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.textKey)}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ p: 2.5, pt: 1 }}>
        <Typography
          variant="overline"
          sx={{ fontWeight: 700, color: "#64748b", letterSpacing: 1.2 }}
        >
          {t("sb.editorialmanagement")}
        </Typography>
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
        {editorialMenuItems.map((item) => {
          const itemRole = item.href.split("role=")[1];
          const isActive = pathname === "/admin/editorregister" && activeRole === itemRole;
          return (
            <ListItem key={item.textKey} disablePadding sx={{ mb: 1 }}>
              <Link
                href={item.href}
                style={{ textDecoration: "none", color: "inherit", width: "100%" }}
              >
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    bgcolor: isActive ? "#f0fdf4" : "transparent",
                    color: isActive ? "#004b23" : "#666",
                    "&:hover": { bgcolor: "#f0fdf4", color: "#004b23" },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={t(item.textKey)}
                    primaryTypographyProps={{ fontWeight: isActive ? 700 : 500 }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>

      <Divider />

      <List sx={{ px: 2, py: 2 }}>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => signOut({ callbackUrl: "/" })}
            sx={{
              borderRadius: 2,
              color: "#d32f2f",
              "&:hover": { bgcolor: "#fef2f2" },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 40 }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={t("sb.logout")} primaryTypographyProps={{ fontWeight: 600 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

const AdminSidebar = ({ open, onClose }: AdminSidebarProps) => (
  <MobileSidebarWrapper open={open} onClose={onClose}>
    {/* Desktop: sticky positioning handled by parent layout */}
    <Box
      sx={{
        width: { xs: 0, md: 280 },
        flexShrink: 0,
        display: { xs: "none", md: "block" },
        position: "sticky",
        top: 64,
        height: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      <SidebarContent />
    </Box>
    {/* Mobile: rendered inside the MobileSidebarWrapper Drawer */}
    <Box sx={{ display: { xs: "block", md: "none" }, height: "100%" }}>
      <SidebarContent />
    </Box>
  </MobileSidebarWrapper>
);

export default AdminSidebar;
