"use client";

import { useState, ChangeEvent, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
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
  MenuItem,
  Grid,
  Divider,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import { 
  RemoveRedEye, 
  VisibilityOff, 
  MenuBookOutlined,
  Person,
  Email,
  School,
  Work,
  Psychology,
  ArrowBack
} from "@mui/icons-material";
import LanguageIcon from "@mui/icons-material/Language";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { useLanguage } from "@/lib/LanguageContext";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const RegisterPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang, setLang, t, dir } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const queryRole = searchParams.get("role");
  const requestedRole = (queryRole === "AUTHOR" || queryRole === "REVIEWER") ? queryRole : "";
  const callbackUrl = searchParams.get("callbackUrl");
  const shouldAutoLogin = searchParams.get("autoLogin") === "1" && requestedRole === "AUTHOR";
  const roles = [
    { value: "AUTHOR", label: lang === "ar" ? "مؤلف" : "Author" },
    { value: "REVIEWER", label: lang === "ar" ? "مراجِع" : "Reviewer" },
  ];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: requestedRole || "AUTHOR",
    university: "",
    qualification: "",
    areaOfExpertise: "",
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (!formData.email) {
      setEmailError("");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setEmailError("");
      return;
    }

    const checkEmail = setTimeout(async () => {
      try {
        const res = await fetch("/api/check-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.exists) {
            setEmailError(
              lang === "ar"
                ? "هذا البريد الإلكتروني مسجل بالفعل. يرجى استخدام بريد إلكتروني آخر."
                : "This email is already registered. Please use a different email."
            );
          } else {
            setEmailError("");
          }
        }
      } catch (err) {
        console.error("Failed to check email:", err);
      }
    }, 400);

    return () => clearTimeout(checkEmail);
  }, [formData.email, lang]);

  const handleNext = () => {
    if (activeStep === 0) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setError(lang === "ar" ? "يرجى ملء جميع المعلومات الأساسية" : "Please fill in all basic information");
        return;
      }
      if (emailError) {
        setError(emailError);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError(lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
        return;
      }
      if (formData.password.length < 8) {
        setError(lang === "ar" ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" : "Password must be at least 8 characters");
        return;
      }
      if (!/[A-Z]/.test(formData.password)) {
        setError(lang === "ar" 
          ? "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل (A–Z)" 
          : "Password must contain at least one uppercase letter (A–Z)");
        return;
      }
      if (!/[0-9]/.test(formData.password)) {
        setError(lang === "ar" 
          ? "يجب أن تحتوي كلمة المرور على رقم واحد على الأقل (0–9)" 
          : "Password must contain at least one number (0–9)");
        return;
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        setError(lang === "ar" 
          ? "يجب أن تحتوي كلمة المرور على رمز خاص واحد على الأقل (مثل @، #، $، إلخ)" 
          : "Password must contain at least one special character (e.g., @, #, $, %, etc.)");
        return;
      }
    }
    setError("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          university: formData.university,
          qualification: formData.qualification,
          areaOfExpertise: formData.areaOfExpertise,
        }),
      });

      if (response.ok) {
        Toast.fire({
          icon: "success",
          title: lang === "ar" ? "تم إنشاء الحساب بنجاح" : "Account created successfully",
        });
        if (shouldAutoLogin && callbackUrl) {
          const result = await signIn("credentials", {
            email: formData.email.trim(),
            password: formData.password.trim(),
            redirect: false,
            callbackUrl,
          });

          if (!result?.error) {
            router.replace(result?.url || callbackUrl);
            router.refresh();
            return;
          }

          setError("Account created, but automatic sign-in failed. Please log in.");
          router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          return;
        }

        router.push("/login");
      } else {
        const data = await response.text();
        setError(data || (lang === "ar" ? "فشل التسجيل" : "Registration failed"));
      }
    } catch (err) {
      setError(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={() => router.back()}
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
        <Container maxWidth="md">
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
                {t("register.title")}
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} sx={{ mb: 5 }}>
              <Step><StepLabel>{lang === "ar" ? "معلومات أساسية" : "Basic Info"}</StepLabel></Step>
              <Step><StepLabel>{lang === "ar" ? "الملف المهني" : "Professional Profile"}</StepLabel></Step>
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {activeStep === 0 ? (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t("register.name")}
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Person color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t("register.email")}
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      error={!!emailError}
                      helperText={emailError}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t("register.password")}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      InputProps={{
                        sx: { borderRadius: 2 },
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOff /> : <RemoveRedEye />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm Password"}
                      name="confirmPassword"
                      type="password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={handleNext}
                      sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                    >
                      {lang === "ar" ? "الخطوة التالية" : "Next Step"}
                    </Button>
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label={t("register.role")}
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      disabled={!!requestedRole}
                      InputProps={{ sx: { borderRadius: 2 } }}
                    >
                      {roles.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t("register.university")}
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><School color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t("register.qualification")}
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Work color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label={t("register.expertise")}
                      name="areaOfExpertise"
                      value={formData.areaOfExpertise}
                      onChange={handleInputChange}
                      InputProps={{
                        startAdornment: <InputAdornment position="start"><Psychology color="action" /></InputAdornment>,
                        sx: { borderRadius: 2 }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      onClick={handleBack}
                      sx={{ py: 1.5, color: '#004b23', borderColor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                    >
                      {lang === "ar" ? "رجوع" : "Back"}
                    </Button>
                  </Grid>
                  <Grid item xs={6}>
                    <Button 
                      fullWidth 
                      type="submit"
                      variant="contained" 
                      disabled={isLoading}
                      sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                    >
                      {isLoading ? t("register.registering") : t("register.button")}
                    </Button>
                  </Grid>
                </Grid>
              )}
            </form>

            <Divider sx={{ my: 4 }}>
              <Typography variant="body2" color="textSecondary">{t("register.alreadyaccount")}</Typography>
            </Divider>

            <Box sx={{ textAlign: 'center' }}>
              <Link href="/login" style={{ textDecoration: 'none', color: '#004b23', fontWeight: 600 }}>
                {t("register.loginnow")}
              </Link>
            </Box>
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#f4f7f6', background: 'linear-gradient(135deg, #004b23 0%, #006400 100%)' }}>
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </Box>
    }>
      <RegisterPageContent />
    </Suspense>
  );
}

