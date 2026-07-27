"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LanguageIcon from "@mui/icons-material/Language";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import AuthProvider from "./auth-provider";
import { useLanguage } from "@/lib/LanguageContext";

const Navbar = () => {
  const session = useSession();
  const router = useRouter();
  const { lang, setLang, t } = useLanguage();

  const navLinks = [
    { href: "/", title: t("nav.home") },
    { href: "/about", title: t("nav.about") },
    { href: "/conference", title: t("nav.conferences") },
    { href: "/archive", title: t("nav.archive") },
    { href: "/contact", title: t("nav.contact") },
  ];

  const mobileAuthLinks = session.data
    ? []
    : [
        { href: "/login", title: t("nav.signin") },
        { href: "/register?role=AUTHOR", title: t("nav.signup") + " (Author)" },
        { href: "/register?role=REVIEWER", title: t("nav.signup") + " (Reviewer)" },
      ];

  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLoginPage = () => {
    router.push("/login");
  };

  const handleLogOut = () => {
    signOut({ callbackUrl: "/" });
  };

  const toggleLang = () => {
    setLang(lang === "en" ? "ar" : "en");
  };

  const [signUpAnchorEl, setSignUpAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleSignUpClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSignUpAnchorEl(event.currentTarget);
  };

  const handleSignUpClose = () => {
    setSignUpAnchorEl(null);
  };

  const handleSelectRole = (role: "AUTHOR" | "REVIEWER") => {
    handleSignUpClose();
    router.push(`/register?role=${role}`);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{
          backgroundColor: "#fefefe",
          padding: "10px",
          color: "#004B23",
          borderBottom: "1px solid #ccc",
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            {/* Mobile hamburger */}
            <Box
              sx={{
                "@media (min-width: 1024px)": { display: "none" },
              }}
            >
              <IconButton
                size="large"
                aria-label="navigation menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{ display: { xs: "block", md: "none" }, color: "#004B23" }}
              >
                {navLinks.map((link) => (
                  <MenuItem key={link.href} onClick={handleCloseNavMenu}>
                    <Link href={link.href} style={{ color: "#004B23", textDecoration: "none" }}>
                      {link.title}
                    </Link>
                  </MenuItem>
                ))}
                {mobileAuthLinks.map((link) => (
                  <MenuItem key={link.href} onClick={handleCloseNavMenu}>
                    <Link href={link.href} style={{ color: "#004B23", textDecoration: "none" }}>
                      {link.title}
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Mobile logo */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                "@media (min-width: 1024px)": { display: "none" },
              }}
            >
              <MenuBookOutlinedIcon
                sx={{ marginRight: "10px", "@media (min-width: 1024px)": { display: "none" } }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2, flexGrow: 1, fontFamily: "monospace", fontWeight: 700,
                  letterSpacing: "2px", color: "inherit", textDecoration: "none",
                  "@media (min-width: 1024px)": { display: "none" },
                }}
              >
                {t("hero.title")}
              </Typography>
            </Box>

            {/* Desktop logo */}
            <Box
              sx={{
                display: "flex", alignItems: "center", gap: "4px",
                "@media (max-width: 1024px)": { display: "none" },
              }}
            >
              <MenuBookOutlinedIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  mr: 2, display: { xs: "none", md: "flex" }, fontFamily: "monospace",
                  fontWeight: 700, letterSpacing: "2px", color: "inherit", textDecoration: "none",
                }}
              >
                {t("hero.title")}
              </Typography>
            </Box>

            {/* Desktop nav links */}
            <Box
              sx={{
                display: "none",
                "@media (min-width: 1024px)": { display: "flex", fontFamily: "inherit" },
              }}
            >
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ marginInline: "10px", color: "#004B23", display: "block" }}
                >
                  {link.title}
                </Link>
              ))}

              {session?.data?.user?.role === "ADMIN" && (
                <Link href="/admin" style={{ marginInline: "10px", color: "#004B23", display: "block" }}>
                  {t("nav.admin")}
                </Link>
              )}
              {session?.data?.user?.role === "EDITOR" && (
                <Link href="/editor" style={{ marginInline: "10px", color: "#004B23", display: "block" }}>
                  {t("nav.editor")}
                </Link>
              )}
              {session?.data?.user?.role === "ASSOCIATE_EDITOR" && (
                <Link href="/associate-editor/dashboard" style={{ marginInline: "10px", color: "#004B23", display: "block" }}>
                  {t("nav.associate")}
                </Link>
              )}
              {session?.data?.user?.role === "GUEST_EDITOR" && (
                <Link href="/guest-editor/dashboard" style={{ marginInline: "10px", color: "#004B23", display: "block" }}>
                  {t("nav.guesteditor") || "Guest Editor"}
                </Link>
              )}
              {session?.data?.user?.role === "REVIEWER" && (
                <Link href="/reviewer" style={{ marginInline: "10px", color: "#004B23", display: "block" }}>
                  {t("nav.reviewer")}
                </Link>
              )}
            </Box>

            {/* Language toggle + Auth button */}
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: "8px", sm: "12px" }, flexShrink: 0 }}>
              <button
                onClick={toggleLang}
                className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-md border border-[#004b23] text-[#004b23] text-xs sm:text-sm font-medium hover:bg-[#004b23] hover:text-white transition-all duration-200"
                title={lang === "en" ? "التبديل إلى العربية" : "Switch to English"}
              >
                <LanguageIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                <span className="hidden sm:inline">{lang === "en" ? "العربية" : "English"}</span>
                <span className="sm:hidden">{lang === "en" ? "ع" : "EN"}</span>
              </button>

              {session.data ? (
                <button
                  className="bg-[#004b23] text-[#fff] px-3 py-2 sm:px-4 sm:py-3 rounded-md font-medium text-xs sm:text-sm hover:text-[#004b23] hover:bg-[#ffff] hover:border border-[#004b23] transition-all duration-200 ease-linear"
                  onClick={handleLogOut}
                >
                  {t("nav.signout")}
                </button>
              ) : (
                <>
                  {/* Sign In / Sign Up hidden on mobile — accessible via hamburger menu */}
                  <button
                    className="hidden lg:block bg-transparent text-[#004b23] border border-[#004b23] w-[100px] px-4 py-3 rounded-md font-medium hover:bg-[#004b23] hover:text-[#fff] transition-all duration-200 ease-linear"
                    onClick={handleLoginPage}
                  >
                    {t("nav.signin")}
                  </button>
                  <button
                    id="signup-button"
                    aria-controls={signUpAnchorEl ? 'signup-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={signUpAnchorEl ? 'true' : undefined}
                    onClick={handleSignUpClick}
                    className="hidden lg:block bg-[#004b23] text-[#fff] w-[100px] px-4 py-3 rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:border border-[#004b23] transition-all duration-200 ease-linear"
                  >
                    {t("nav.signup")}
                  </button>
                  <Menu
                    id="signup-menu"
                    anchorEl={signUpAnchorEl}
                    open={Boolean(signUpAnchorEl)}
                    onClose={handleSignUpClose}
                    MenuListProps={{
                      'aria-labelledby': 'signup-button',
                    }}
                    PaperProps={{
                      elevation: 4,
                      sx: {
                        mt: 1,
                        borderRadius: 2,
                        minWidth: 150,
                        boxShadow: '0px 8px 24px rgba(0, 75, 35, 0.15)',
                        border: '1px solid rgba(0, 75, 35, 0.08)',
                        '& .MuiMenuItem-root': {
                          fontSize: '0.95rem',
                          fontWeight: 500,
                          color: '#004b23',
                          padding: '10px 16px',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 75, 35, 0.08)',
                            color: '#004b23',
                          },
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={() => handleSelectRole("AUTHOR")}>
                      {lang === "ar" ? "مؤلف (Author)" : "Author"}
                    </MenuItem>
                    <MenuItem onClick={() => handleSelectRole("REVIEWER")}>
                      {lang === "ar" ? "مراجِع (Reviewer)" : "Reviewer"}
                    </MenuItem>
                  </Menu>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
};

const NavbarComponent = () => {
  return (
    <AuthProvider>
      <Navbar />
    </AuthProvider>
  );
};

export default NavbarComponent;
