"use client";
import { Container, Typography } from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import AboutTabs from "./about-tabs";
import { useLanguage } from "@/lib/LanguageContext";

const About = () => {
  const { t } = useLanguage();

  return (
    <Container sx={{ marginBlock: "20px" }}>
      <Box sx={{ width: "100%", background: "#f5f5f5", padding: "30px " }}>
        <Typography
          component={"h2"}
          sx={{
            fontSize: "28px",
            fontFamily: "inherit",
            color: "#004B23",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          {t("about.title")}
        </Typography>
        <AboutTabs />
      </Box>
    </Container>
  );
};

export default About;
