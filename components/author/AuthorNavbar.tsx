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
  Button
} from "@mui/material";
import { 
  Logout, 
  Add
} from "@mui/icons-material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const AuthorNavbar = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        bgcolor: '#fff', 
        color: '#004b23', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
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
              href="/author"
              sx={{
                fontWeight: 800,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              AUTHOR PANEL
            </Typography>
          </Box>
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Link href="/author" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Dashboard</Link>
            <Link href="/publish" style={{ textDecoration: 'none', color: '#666', fontWeight: 600 }}>Submit Paper</Link>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            variant="contained" 
            startIcon={<Add />}
            href="/publish"
            sx={{ bgcolor: '#004b23', '&:hover': { bgcolor: '#003318' }, borderRadius: 2, display: { xs: 'none', sm: 'flex' } }}
          >
            New Submission
          </Button>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar sx={{ bgcolor: '#004b23' }}>
                  {session?.user?.name?.charAt(0) || 'U'}
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
                <Typography variant="body2" color="textSecondary">Author Account</Typography>
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
  );
};

export default AuthorNavbar;
