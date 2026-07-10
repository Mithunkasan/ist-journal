"use client";

import React from "react";
import {
  Drawer,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";

interface MobileSidebarWrapperProps {
  /** Whether the mobile drawer is open */
  open: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  children: React.ReactNode;
}

/**
 * Shared wrapper that renders the sidebar in a MUI Drawer on mobile
 * (xs / sm) and as a sticky panel on md+ screens.
 * All dashboard role sidebars use this wrapper for consistent
 * responsive behaviour.
 */
const MobileSidebarWrapper = ({
  open,
  onClose,
  children,
}: MobileSidebarWrapperProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (isMobile) {
    return (
      <Drawer
        anchor="left"
        open={open}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Close on nav-link click by wrapping children in click handler */}
        <Box onClick={onClose} sx={{ height: "100%" }}>
          {children}
        </Box>
      </Drawer>
    );
  }

  // Desktop — render inline as normal sticky sidebar
  return <>{children}</>;
};

export default MobileSidebarWrapper;
