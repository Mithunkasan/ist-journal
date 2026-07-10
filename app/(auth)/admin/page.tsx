"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, useCallback, Suspense } from "react";
import Link from "next/link";
import { DEFAULT_ADMIN_REDIRECT } from "@/routes";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import { Box, Typography, Container, Paper, TextField, Button, InputAdornment, IconButton, Alert } from "@mui/material";
import { motion } from "framer-motion";

const AdminLoginPageContent = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const getRedirectPath = useCallback(() => {
    return searchParams.get("callbackUrl") || DEFAULT_ADMIN_REDIRECT;
  }, [searchParams]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "ADMIN") {
      router.push(getRedirectPath());
    } else if (status === "authenticated" && session?.user?.role !== "ADMIN") {
        setLoginError("Unauthorized. This portal is for Administrators only.");
    }
  }, [session, status, router, getRedirectPath]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    try {
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password.trim(),
        redirect: false,
      });

      if (result?.error) {
        setLoginError("Invalid credentials. Please try again.");
      }
    } catch (error) {
      setLoginError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7f6' }}>
        <div className="w-12 h-12 border-4 border-[#004b23] border-t-transparent rounded-full animate-spin" />
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: '#f4f7f6',
        background: 'linear-gradient(135deg, #004b23 0%, #006400 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={10} 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255, 255, 255, 0.95)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
              <MenuBookOutlinedIcon sx={{ fontSize: 40, color: '#004b23', mr: 1 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#004b23', letterSpacing: -1 }}>
                IST Admin
              </Typography>
            </Box>

            <Typography variant="h6" sx={{ mb: 4, color: '#666', textAlign: 'center' }}>
              Secure Gateway for Journal Administrators
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                {loginError}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <TextField
                fullWidth
                label="Administrator Email"
                name="email"
                type="email"
                variant="outlined"
                required
                value={formData.email}
                onChange={handleInputChange}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { borderRadius: 2 }
                }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                required
                value={formData.password}
                onChange={handleInputChange}
                sx={{ mb: 4 }}
                InputProps={{
                  sx: { borderRadius: 2 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOffIcon /> : <RemoveRedEyeIcon />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={isLoading}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2, 
                  bgcolor: '#004b23',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#003318'
                  }
                }}
              >
                {isLoading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </form>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Link href="/" style={{ textDecoration: 'none', color: '#004b23', fontWeight: 500 }}>
                &larr; Back to Journal Homepage
              </Link>
            </Box>
          </Paper>
          
          <Typography variant="body2" sx={{ mt: 4, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} International Scientific and Technological Journal. All rights reserved.
          </Typography>
        </Container>
      </motion.div>
    </Box>
  );
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7f6' }}>
        <div className="w-12 h-12 border-4 border-[#004b23] border-t-transparent rounded-full animate-spin" />
      </Box>
    }>
      <AdminLoginPageContent />
    </Suspense>
  );
}
