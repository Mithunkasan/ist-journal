"use client";
import React from "react";
import Box from "@mui/material/Box";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const ChiefEditor = () => {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        backgroundColor: "#f5f5f5",
        marginTop: "20px",
        padding: "20px 30px",
      }}
    >
      <Container>
        <Typography
          component={"p"}
          sx={{
            display: "flex",
            gap: "10px",
            marginBottom: "30px",
            fontSize: { xs: "18px", sm: "22px", md: "25px" },
            fontWeight: 700,
            alignItems: "center",
            flexWrap: "wrap",
            transition: "all 0.4s ease-out",
          }}
        >
          {t("editor.title")}{" "}
          <span style={{ fontWeight: "normal", fontSize: "16px" }}>|</span>{" "}
          <Link href="/editorial-board" passHref>
            <Box
              component={"span"}
              sx={{
                fontWeight: "normal",
                fontSize: "16px",
                cursor: "pointer",
                ":hover": {
                  borderBottom: "2px solid #9EF01A",
                },
              }}
            >
              {" "}
              {t("editor.viewboard")}
            </Box>
          </Link>
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <Image
            src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1780&auto=format&fit=crop"
            alt="Editor in Chief"
            width={100}
            height={100}
            style={{
              borderRadius: "50%",
            }}
            priority
          />
          <Box>
            <Typography
              sx={{
                marginBottom: "5px",
                fontSize: { xs: "16px", sm: "18px", md: "20px" },
                fontWeight: "bold",
              }}
            >
              {t("editor.name")}
            </Typography>
            <Typography sx={{ fontSize: "14px" }}>
              {t("editor.affiliation")}
            </Typography>
            <Link
              href="https://scholar.google.com"
              target="_blank"
              style={{ fontSize: "12px", color: "#004B23", textDecoration: "underline" }}
            >
              Google Scholar Profile
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default ChiefEditor;
