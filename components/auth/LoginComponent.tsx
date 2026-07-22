"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, ChangeEvent, useCallback } from "react";
import Link from "next/link";
import {
  DEFAULT_LOGIN_REDIRECT,
  DEFAULT_ADMIN_REDIRECT,
  DEFAULT_EDITOR_REDIRECT,
  DEFAULT_ASSOCIATE_EDITOR_REDIRECT,
  DEFAULT_REVIEWER_REDIRECT
} from "@/routes";
import { 
  RemoveRedEye, 
  VisibilityOff, 
  MenuBookOutlined,
  Email,
  Lock,
  ArrowBack
} from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { 
  Box, 
  Typography, 
  Container, 
  Paper, 
  TextField, 
  Button, 
  InputAdornment, 
  IconButton, 
  Alert,
  Divider,
  MenuItem
} from "@mui/material";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/LanguageContext";

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, setLang, t, dir } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [passwordShow, setShowPassword] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState({
    email: false,
    password: false,
    btnDisabled: true,
  });

  const [roles, setRoles] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  useEffect(() => {
    if (!formData.email) {
      setRoles([]);
      setSelectedRole("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setRoles([]);
      setSelectedRole("");
      return;
    }

    const checkEmail = setTimeout(async () => {
      try {
        const res = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email.trim() }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.exists && data.roles) {
            setRoles(data.roles);
            if (data.roles.includes("AUTHOR") && data.roles.includes("REVIEWER")) {
              setSelectedRole("AUTHOR");
            } else {
              setSelectedRole(data.roles[0] || "");
            }
          } else {
            setRoles([]);
            setSelectedRole("");
          }
        }
      } catch (err) {
        console.error("Failed to check email on login:", err);
      }
    }, 400);

    return () => clearTimeout(checkEmail);
  }, [formData.email]);

  // Helper function to determine redirect path
  const getRedirectPath = useCallback(() => {
    if (searchParams.get("callbackUrl")) {
      return searchParams.get("callbackUrl")!;
    }

    switch (session?.user?.role) {
      case "ADMIN":
        return DEFAULT_ADMIN_REDIRECT;
      case "EDITOR":
        return DEFAULT_EDITOR_REDIRECT;
      case "ASSOCIATE_EDITOR":
        return DEFAULT_ASSOCIATE_EDITOR_REDIRECT;
      case "REVIEWER":
        return DEFAULT_REVIEWER_REDIRECT;
      default:
        return DEFAULT_LOGIN_REDIRECT;
    }
  }, [searchParams, session?.user?.role]);
  
  const handleSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError("");

    // Form validation
    if (formData.email.trim() === "") {
      setError(prev => ({ ...prev, email: true }));
      setIsLoading(false);
      return;
    }
    
    if (formData.password.trim() === "") {
      setError(prev => ({ ...prev, password: true }));
      setIsLoading(false);
      return;
    }

    try {
      const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
      const result = await signIn("credentials", {
        email: formData.email.trim(),
        password: formData.password.trim(),
        role: selectedRole,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        let errorMsg = lang === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صالحة" : "Invalid email or password";
        
        try {
          const userRes = await fetch("/api/get-user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ data: { email: formData.email.trim(), role: selectedRole } })
          });
          if (userRes.ok) {
            const userData = await userRes.json();
            if (userData && userData.role === "REVIEWER" && userData.Status === "IN_ACTIVE") {
              errorMsg = lang === "ar"
                ? "حساب المراجع الخاص بك قيد انتظار موافقة المحرر"
                : "Your reviewer account is pending Editor approval";
            }
          }
        } catch (e) {
          console.error("Error checking user status:", e);
        }

        setLoginError(errorMsg);
        setIsLoading(false);
        return;
      }

      router.replace(result?.url || callbackUrl);
      router.refresh();
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError(lang === "ar" ? "حدث خطأ غير متوقع أثناء تسجيل الدخول" : "An unexpected error occurred during login");
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setFormData((prevAnswer) => ({
      ...prevAnswer,
      [property]: event.target.value,
    }));
  };

  useEffect(() => {
    const isFormValid =
      formData.email.trim() !== "" && formData.password.trim() !== "";

    setError((prev) => ({
      ...prev,
      btnDisabled: !isFormValid,
    }));
  }, [formData]);

  // Add useEffect to handle session changes
  useEffect(() => {
    if (status === "authenticated" && session?.user?.role) {
      const redirectPath = getRedirectPath();
      router.push(redirectPath);
    }
  }, [session, status, getRedirectPath, router]);

  // Prevent authenticated users from seeing login page
  if (status === "authenticated") {
    return null;
  }

  return (
    <Box 
      dir={dir}
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        bgcolor: '#f4f7f6',
        background: 'linear-gradient(135deg, #004b23 0%, #006400 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        p: 3,
        position: 'relative'
      }}
    >
      <div className="absolute top-4 left-4 z-50">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-white text-white bg-transparent text-sm font-medium hover:bg-white hover:text-[#004b23] transition-all duration-200 shadow-sm"
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          Back
        </button>
      </div>

      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={() => setLang(lang === "en" ? "ar" : "en")}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-white text-white bg-transparent text-sm font-medium hover:bg-white hover:text-[#004b23] transition-all duration-200 shadow-sm"
          title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
        >
          <LanguageIcon sx={{ fontSize: 18 }} />
          {lang === "en" ? "العربية" : "English"}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Container maxWidth="sm">
          <Paper 
            elevation={10} 
            sx={{ 
              p: { xs: 4, md: 6 }, 
              borderRadius: 4,
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(255, 255, 255, 0.98)',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, justifyContent: 'center' }}>
              <MenuBookOutlined sx={{ fontSize: 40, color: '#004b23', mr: 1 }} />
              <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: '#004b23', letterSpacing: -1 }}>
                {t("hero.title")}
              </Typography>
            </Box>

            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#111827' }}>
              {t("login.title")}
            </Typography>

            {loginError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {loginError}
              </Alert>
            )}

            <form onSubmit={handleSignin}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField
                  fullWidth
                  label={t("login.email")}
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange(e, "email")}
                  error={error.email && formData.email.trim() === ""}
                  helperText={error.email && formData.email.trim() === "" ? t("login.required") : ""}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                    sx: { borderRadius: 2 }
                  }}
                />

                {roles.includes("AUTHOR") && roles.includes("REVIEWER") && (
                  <TextField
                    fullWidth
                    select
                    label={lang === "ar" ? "الدخول بصفتك" : "Login As"}
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    InputProps={{ sx: { borderRadius: 2 } }}
                  >
                    <MenuItem value="AUTHOR">{lang === "ar" ? "مؤلف" : "Author"}</MenuItem>
                    <MenuItem value="REVIEWER">{lang === "ar" ? "مراجِع" : "Reviewer"}</MenuItem>
                  </TextField>
                )}

                <TextField
                  fullWidth
                  label={t("login.password")}
                  name="password"
                  type={passwordShow ? "password" : "text"}
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  error={error.password && formData.password.trim() === ""}
                  helperText={error.password && formData.password.trim() === "" ? t("login.required") : ""}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                    sx: { borderRadius: 2 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!passwordShow)} edge="end">
                          {passwordShow ? <VisibilityOff /> : <RemoveRedEye />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: -1 }}>
                  <Link href="/forgot-password" style={{ textDecoration: "none", color: "#004b23", fontWeight: 600, fontSize: "0.875rem" }}>
                    {lang === "ar" ? "هل نسيت كلمة المرور؟" : "Forgot Password?"}
                  </Link>
                </Box>

                <Button 
                  fullWidth 
                  type="submit"
                  variant="contained" 
                  disabled={error.btnDisabled || isLoading}
                  sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                >
                  {isLoading ? t("login.signingin") : t("login.button")}
                </Button>
              </Box>
            </form>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="textSecondary">{t("login.noaccount")}</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Link href="/register" style={{ textDecoration: 'none', color: '#004b23', fontWeight: 600 }}>
                {t("login.registernow")}
              </Link>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default LoginPage;
