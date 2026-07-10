import React from "react";
import Box from "@mui/material/Box";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import Typography from "@mui/material/Typography";
import { useLanguage } from "@/lib/LanguageContext";

interface LogoProps {
  color: string;
}

const Logo = (props: LogoProps) => {
  const { t } = useLanguage();
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <MenuBookOutlinedIcon
        sx={{
          marginRight: "10px",
          color: props?.color,
          cursor: "default",
        }}
      />
      <Typography
        variant="h5"
        noWrap
        component="a"
        href="#app-bar-with-responsive-menu"
        sx={{
          mr: 2,
          flexGrow: 1,
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: "2px",
          color: props?.color,
          textDecoration: "none",
          cursor: "default",
        }}
      >
        {t("hero.title")}
      </Typography>
    </Box>
  );
};

export default Logo;
