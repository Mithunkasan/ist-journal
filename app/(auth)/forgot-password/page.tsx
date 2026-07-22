"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Grid
} from "@mui/material";
import { 
  RemoveRedEye, 
  VisibilityOff, 
  MenuBookOutlined,
  Email,
  Lock,
  ArrowBack,
  VpnKey
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

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { lang, setLang, dir } = useLanguage();
  const [step, setStep] = useState(0); // 0: Request OTP, 1: Verify OTP, 2: Reset Password, 3: Success
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [rolesToChoose, setRolesToChoose] = useState<string[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError(lang === "ar" ? "الرجاء إدخال البريد الإلكتروني" : "Please enter your email");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const checkRes = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!checkRes.ok) {
        const errorText = await checkRes.text();
        setError(errorText || (lang === "ar" ? "فشل التحقق من البريد الإلكتروني" : "Failed to check email"));
        setIsLoading(false);
        return;
      }

      const checkData = await checkRes.json();
      if (!checkData.exists) {
        setError(lang === "ar" ? "هذا البريد الإلكتروني غير مسجل." : "This email is not registered.");
        setIsLoading(false);
        return;
      }

      const roles = checkData.roles || [];
      const hasBoth = roles.includes("AUTHOR") && roles.includes("REVIEWER");

      if (hasBoth) {
        setRolesToChoose(roles);
        setSelectedRole("AUTHOR"); // default selection
        setIsLoading(false);
      } else {
        const roleToSend = roles[0] || "AUTHOR"; // fallback
        setSelectedRole(roleToSend);
        await sendOtp(roleToSend);
      }
    } catch (err) {
      setError(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
      setIsLoading(false);
    }
  };

  const sendOtp = async (role: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), role }),
      });

      if (res.ok) {
        Toast.fire({
          icon: "success",
          title: lang === "ar" ? "تم إرسال رمز التحقق" : "OTP sent successfully",
        });
        setStep(1);
      } else {
        const data = await res.text();
        setError(data || (lang === "ar" ? "فشل إرسال رمز التحقق" : "Failed to send OTP"));
      }
    } catch (err) {
      setError(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError(lang === "ar" ? "الرجاء إدخال رمز التحقق" : "Please enter verification code");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, role: selectedRole }),
      });

      if (res.ok) {
        Toast.fire({
          icon: "success",
          title: lang === "ar" ? "تم التحقق من الرمز بنجاح" : "OTP verified successfully",
        });
        setStep(2);
      } else {
        const data = await res.text();
        setError(data || (lang === "ar" ? "رمز التحقق غير صالح" : "Invalid OTP code"));
      }
    } catch (err) {
      setError(lang === "ar" ? "حدث خطأ غير متوقع" : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError(lang === "ar" ? "الرجاء تعبئة جميع الحقول" : "Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError(lang === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError(lang === "ar" ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" : "Password must be at least 8 characters");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password, role: selectedRole }),
      });

      if (res.ok) {
        Toast.fire({
          icon: "success",
          title: lang === "ar" ? "تم تغيير كلمة المرور بنجاح" : "Password reset successfully",
        });
        setStep(3);
      } else {
        const data = await res.text();
        setError(data || (lang === "ar" ? "فشل إعادة تعيين كلمة المرور" : "Failed to reset password"));
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
          onClick={() => {
            if (step === 1 && rolesToChoose.length > 0) {
              setRolesToChoose([]);
              setError("");
            } else if (step > 0 && step < 3) {
              setStep(step - 1);
              setError("");
            } else {
              router.push("/");
            }
          }}
          className="flex items-center gap-1 px-3 py-2 rounded-md border border-white text-white bg-transparent text-sm font-medium hover:bg-white hover:text-[#004b23] transition-all duration-200 shadow-sm"
        >
          <ArrowBack sx={{ fontSize: 18 }} />
          {lang === "ar" ? "رجوع" : "Back"}
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
                {lang === "ar" ? "مجلة IST الإلكترونية" : "IST Online Journal"}
              </Typography>
            </Box>

            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 3, textAlign: 'center', color: '#111827' }}>
              {lang === "ar" ? "استعادة كلمة المرور" : "Reset Password"}
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            {step === 0 && rolesToChoose.length === 0 && (
              <form onSubmit={handleSendOtp}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1, textAlign: 'center' }}>
                    {lang === "ar" 
                      ? "أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز OTP لإعادة تعيين كلمة المرور." 
                      : "Enter your registered email address and we'll send you an OTP to reset your password."}
                  </Typography>
                  <TextField
                    fullWidth
                    label={lang === "ar" ? "البريد الإلكتروني" : "Email Address"}
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment>,
                      sx: { borderRadius: 2 }
                    }}
                  />
                  <Button 
                    fullWidth 
                    type="submit"
                    variant="contained" 
                    disabled={isLoading}
                    sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                  >
                    {isLoading 
                      ? (lang === "ar" ? "جاري الإرسال..." : "Sending...") 
                      : (lang === "ar" ? "إرسال رمز التحقق" : "Send Verification Code")}
                  </Button>
                </Box>
              </form>
            )}

            {step === 0 && rolesToChoose.length > 0 && (
              <form onSubmit={(e) => { e.preventDefault(); sendOtp(selectedRole); }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1, textAlign: 'center', color: '#111827' }}>
                    {lang === "ar" 
                      ? "تم العثور على حسابين مرتبطين بهذا البريد الإلكتروني. يرجى اختيار نوع الحساب الذي ترغب في إعادة تعيين كلمة المرور له:" 
                      : "We found two accounts associated with this email. Please select which account you want to reset:"}
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant={selectedRole === "AUTHOR" ? "contained" : "outlined"}
                        onClick={() => setSelectedRole("AUTHOR")}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          fontWeight: 700,
                          bgcolor: selectedRole === "AUTHOR" ? '#004b23' : 'transparent',
                          color: selectedRole === "AUTHOR" ? '#fff' : '#004b23',
                          borderColor: '#004b23',
                          '&:hover': {
                            bgcolor: selectedRole === "AUTHOR" ? '#003318' : 'rgba(0, 75, 35, 0.04)',
                            borderColor: '#004b23',
                          }
                        }}
                      >
                        {lang === "ar" ? "حساب المؤلف" : "Author Account"}
                      </Button>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Button
                        fullWidth
                        variant={selectedRole === "REVIEWER" ? "contained" : "outlined"}
                        onClick={() => setSelectedRole("REVIEWER")}
                        sx={{
                          py: 2,
                          borderRadius: 2,
                          fontWeight: 700,
                          bgcolor: selectedRole === "REVIEWER" ? '#004b23' : 'transparent',
                          color: selectedRole === "REVIEWER" ? '#fff' : '#004b23',
                          borderColor: '#004b23',
                          '&:hover': {
                            bgcolor: selectedRole === "REVIEWER" ? '#003318' : 'rgba(0, 75, 35, 0.04)',
                            borderColor: '#004b23',
                          }
                        }}
                      >
                        {lang === "ar" ? "حساب المراجع" : "Reviewer Account"}
                      </Button>
                    </Grid>
                  </Grid>

                  <Button 
                    fullWidth 
                    type="submit"
                    variant="contained" 
                    disabled={isLoading}
                    sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700, mt: 1 }}
                  >
                    {isLoading 
                      ? (lang === "ar" ? "جاري الإرسال..." : "Sending...") 
                      : (lang === "ar" ? "تأكيد وإرسال الرمز" : "Confirm & Send Code")}
                  </Button>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => {
                      setRolesToChoose([]);
                      setError("");
                    }}
                    sx={{ color: '#666', fontWeight: 600 }}
                  >
                    {lang === "ar" ? "تغيير البريد الإلكتروني" : "Change Email"}
                  </Button>
                </Box>
              </form>
            )}

            {step === 1 && (
              <form onSubmit={handleVerifyOtp}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 1, textAlign: 'center' }}>
                    {lang === "ar"
                      ? `تم إرسال رمز تحقق مكون من 6 أرقام إلى: ${email}`
                      : `A 6-digit verification code has been sent to: ${email}`}
                  </Typography>
                  <TextField
                    fullWidth
                    label={lang === "ar" ? "رمز التحقق (OTP)" : "Verification Code (OTP)"}
                    name="otp"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><VpnKey color="action" /></InputAdornment>,
                      sx: { borderRadius: 2 }
                    }}
                  />
                  <Button 
                    fullWidth 
                    type="submit"
                    variant="contained" 
                    disabled={isLoading}
                    sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                  >
                    {isLoading 
                      ? (lang === "ar" ? "جاري التحقق..." : "Verifying...") 
                      : (lang === "ar" ? "التحقق من الرمز" : "Verify Code")}
                  </Button>
                </Box>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleResetPassword}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    fullWidth
                    label={lang === "ar" ? "كلمة المرور الجديدة" : "New Password"}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
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
                  <TextField
                    fullWidth
                    label={lang === "ar" ? "تأكيد كلمة المرور" : "Confirm New Password"}
                    name="confirmPassword"
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                      sx: { borderRadius: 2 }
                    }}
                  />
                  <Button 
                    fullWidth 
                    type="submit"
                    variant="contained" 
                    disabled={isLoading}
                    sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                  >
                    {isLoading 
                      ? (lang === "ar" ? "جاري الحفظ..." : "Saving...") 
                      : (lang === "ar" ? "إعادة تعيين كلمة المرور" : "Reset Password")}
                  </Button>
                </Box>
              </form>
            )}

            {step === 3 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="#004b23" sx={{ fontWeight: 700 }}>
                  {lang === "ar" ? "تم تغيير كلمة المرور بنجاح!" : "Password Reset Successfully!"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {lang === "ar" 
                    ? "يمكنك الآن تسجيل الدخول إلى حسابك باستخدام كلمة المرور الجديدة." 
                    : "You can now log in to your account with your new password."}
                </Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  onClick={() => router.push("/login")}
                  sx={{ py: 1.5, bgcolor: '#004b23', borderRadius: 2, fontWeight: 700 }}
                >
                  {lang === "ar" ? "الذهاب لتسجيل الدخول" : "Back to Login"}
                </Button>
              </Box>
            )}
          </Paper>
        </Container>
      </motion.div>
    </Box>
  );
}
