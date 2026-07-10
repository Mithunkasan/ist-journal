"use client";
import React from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

const Hero = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleSubmitPaper = () => {
    router.push("/journals");
  };

  return (
    <Grid
      container
      sx={{
        backgroundImage: "linear-gradient(to right, #0c6504, #398b24)",
        padding: { xs: "30px 20px", md: "50px" },
      }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        sx={{ display: "flex", justifyContent: "center", mb: { xs: 3, md: 0 } }}
      >
        <Image
          src={"/uploads/journalimage.webp"}
          alt="IST Journal — International Scientific and Technological Journal Cover"
          width={200}
          height={280}
          style={{
            boxShadow: "-8px 12px 6px 2px rgba(0,0,0,0.75)",
          }}
          priority
        />
      </Grid>

      <Grid
        item
        xs={12}
        sm={12}
        md={6}
        lg={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          justifyContent: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", color: "#fff", gap: "20px" }}>
          <MenuBookOutlinedIcon sx={{ fontSize: "34px", fontWeight: "bold" }} />
          <Typography
            variant="h1"
            component="h1"
            noWrap
            sx={{
              mr: 2,
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "inherit",
              textDecoration: "none",
              fontSize: { xs: "22px", md: "32px" },
            }}
          >
            {t("hero.title")}
          </Typography>
        </Box>

        <Typography
          component="p"
          sx={{ fontSize: { xs: "16px", md: "20px" }, color: "#fff", fontWeight: "semibold" }}
        >
          {t("hero.subtitle")}
        </Typography>

        {/* ISSN Display */}
        <Typography
          component="p"
          sx={{ fontSize: "16px", color: "#CCFF33", fontWeight: "bold", letterSpacing: "1px" }}
        >
          {t("hero.issn")}
        </Typography>

        <Box sx={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <button
            id="submit-paper-btn"
            onClick={handleSubmitPaper}
            aria-label="Submit your research paper to IST Journal"
            className="bg-[#fff] text-[#004B23] px-4 py-3 rounded-md font-medium hover:text-[#fff] hover:bg-[#004B23] transition-all duration-200 ease-linear"
          >
            {t("hero.submit")}
          </button>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Hero;
