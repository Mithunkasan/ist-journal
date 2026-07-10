"use client";

import React from "react";
import { 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem, 
  Tooltip,
  Divider,
  ListItemIcon,
  Container
} from "@mui/material";
import { 
  Logout, 
  Dashboard as DashboardIcon
} from "@mui/icons-material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

interface DashboardLayoutProps {
  children: React.ReactNode;
  roleName: string;
  rolePath: string;
}

const DashboardLayout = ({ children, roleName, rolePath }: DashboardLayoutProps) => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f7f6' }}>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: '#fff', 
          color: '#004b23', 
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <MenuBookOutlinedIcon sx={{ mr: 1, fontSize: 30 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href={rolePath}
                sx={{
                  fontWeight: 800,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                IST {roleName.toUpperCase()} PORTAL
              </Typography>
            </Box>
            
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
              <Link href={rolePath} style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Dashboard</Link>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: '#004b23' }}>
                    {session?.user?.name?.charAt(0) || roleName.charAt(0)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseUserMenu}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{session?.user?.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{roleName}</Typography>
                </Box>
                <Divider />
                <MenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <ListItemIcon><Logout fontSize="small" sx={{ color: '#d32f2f' }} /></ListItemIcon>
                  <Typography color="error">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>

      <Box 
        component="footer" 
        sx={{ 
          py: 3, 
          px: 2, 
          mt: 'auto', 
          bgcolor: '#fff', 
          borderTop: '1px solid #e0e0e0',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="textSecondary">
          &copy; {new Date().getFullYear()} International Scientific and Technological Journal - {roleName} Portal
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
