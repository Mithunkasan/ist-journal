"use client";
import { Box, Container, Grid, Typography } from "@mui/material";
import homePageContent from "@/lib/mockapi/src/fakedb/HomePage";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Footer() {
  const { lang, t } = useLanguage();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#004B23",
        marginTop: "20px",
        paddingBlock: "50px",
        color: "#fff",
        width: "100%",
        justifySelf: "end",
      }}
    >
      <Container>
        <Grid container spacing={2}>
          {homePageContent?.footerContent?.map((data, index) => (
            <Grid
              item
              xs={12} sm={6} md={3} lg={3}
              key={index + 1}
              sx={{
                "@media(max-width:700px)": {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  textAlign: "center",
                },
              }}
            >
              <Typography
                component={"h4"}
                sx={{
                  color: "#CCFF33",
                  fontSize: "20px",
                  marginBottom: "25px",
                  fontWeight: "bold",
                }}
              >
                {lang === "ar" && data.titleAr ? data.titleAr : data?.title}
              </Typography>

              <ul>
                {data?.links?.map((link, index) => (
                  <Link href={link?.href} key={index + 1}>
                    <li
                      style={{ marginBottom: "10px", color: "#e0e0e0" }}
                      onMouseEnter={(e: React.MouseEvent<HTMLLIElement>) =>
                        (e.currentTarget.style.color = "#fff")
                      }
                      onMouseLeave={(e: React.MouseEvent<HTMLLIElement>) =>
                        (e.currentTarget.style.color = "#e0e0e0")
                      }
                    >
                      {lang === "ar" && link.titleAr ? link.titleAr : link?.title}
                    </li>
                  </Link>
                ))}
              </ul>
            </Grid>
          ))}
        </Grid>
        
        {/* Footer Bottom info for Libyan Journal Criteria */}
        <Box sx={{ borderTop: "1px solid #1a6b3d", mt: 5, pt: 3, textAlign: "center" }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            {t("footer.owner")}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1, color: "#CCFF33" }}>
            {t("footer.issn")}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {t("footer.copyright")}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
