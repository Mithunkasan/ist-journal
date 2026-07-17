"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Dashboard,
  Settings,
  Logout,
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
  { textKey: "sb.overview", icon: <Dashboard />, href: "/guest-editor/dashboard" },
  { textKey: "sb.settings", icon: <Settings />, href: "/guest-editor/dashboard/settings" },
];

interface GuestSidebarProps {
  open: boolean;
  onClose: () => void;
}

const SidebarContent = () => {
  const pathname = usePathname();
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
          {t("sb.guestmenu") || "Guest Editor Menu"}
        </Typography>
      </Box>
      <List sx={{ px: 2, flexGrow: 1 }}>
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

const GuestSidebar = ({ open, onClose }: GuestSidebarProps) => (
  <MobileSidebarWrapper open={open} onClose={onClose}>
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
    <Box sx={{ display: { xs: "block", md: "none" }, height: "100%" }}>
      <SidebarContent />
    </Box>
  </MobileSidebarWrapper>
);

export default GuestSidebar;
