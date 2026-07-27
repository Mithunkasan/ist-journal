"use client";
import { Box, Container } from "@mui/material";
import React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const SecondaryNavbar = () => {
  const { t } = useLanguage();
  const [articlesAnchorEl, setArticlesAnchorEl] = React.useState<null | HTMLElement>(null);
  const [aboutAnchorEl, setAboutAnchorEl] = React.useState<null | HTMLElement>(null);
  const [publishAnchorEl, setPublishAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleArticlesClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setArticlesAnchorEl(event.currentTarget);
  };
  const handleAboutClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAboutAnchorEl(event.currentTarget);
  };
  const handlePublishClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPublishAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setArticlesAnchorEl(null);
    setAboutAnchorEl(null);
    setPublishAnchorEl(null);
  };

  const menuItemSx = {
    transition: "all 0.3s ease",
    ":hover": { color: "#006400", backgroundColor: "transparent" },
  };

  const ArrowIcon = (anchorEl: HTMLElement | null) =>
    anchorEl
      ? React.createElement(IoIosArrowUp as React.ElementType, { size: 20 })
      : React.createElement(IoIosArrowDown as React.ElementType, { size: 20 });

  return (
    <Box sx={{ borderBottom: "1px solid #dcdcdc", position: "sticky", top: "0px", backgroundColor: "#EEEEEE", zIndex: 5 }}>
      <Container sx={{ paddingBlock: { xs: "12px", sm: "16px", md: "20px" }, display: "flex", gap: { xs: "10px", sm: "16px", md: "20px" }, justifyContent: "space-around", flexWrap: "wrap", rowGap: { xs: "8px", sm: "10px" }, fontSize: { xs: "13px", sm: "14px", md: "inherit" } }}>

        {/* Articles & Issues */}
        <Box>
          <button onClick={handleArticlesClick} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {t("snav.articles")} <span>{ArrowIcon(articlesAnchorEl)}</span>
          </button>
          <Menu anchorEl={articlesAnchorEl} open={Boolean(articlesAnchorEl)} onClose={handleMenuClose}
            PaperProps={{ sx: { border: "2px solid #d2d2d2", padding: "15px 10px" } }}>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/archive">{t("snav.latest")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/archive">{t("snav.allissues")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/archive">{t("snav.inpress")}</Link>
            </MenuItem>
          </Menu>
        </Box>

        {/* Author */}
        <Box>
          <button onClick={handleAboutClick} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {t("snav.author")} <span>{ArrowIcon(aboutAnchorEl)}</span>
          </button>
          <Menu anchorEl={aboutAnchorEl} open={Boolean(aboutAnchorEl)} onClose={handleMenuClose}
            PaperProps={{ sx: { border: "2px solid #d2d2d2", padding: "15px 10px" } }}>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/journals">{t("snav.submitarticle")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/publish/track-status">{t("snav.track")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/aims-scope">{t("snav.aims")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/editorial-board">{t("snav.board")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/journal-insights">{t("snav.insights")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/indexing">{t("snav.indexing")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/announcements">{t("snav.announcements")}</Link>
            </MenuItem>
          </Menu>
        </Box>

        {/* Publish */}
        <Box>
          <button onClick={handlePublishClick} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {t("snav.publish")} <span>{ArrowIcon(publishAnchorEl)}</span>
          </button>
          <Menu anchorEl={publishAnchorEl} open={Boolean(publishAnchorEl)} onClose={handleMenuClose}
            PaperProps={{ sx: { border: "2px solid #d2d2d2", padding: "15px 10px" } }}>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/journals">{t("snav.submitarticle")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/publish/guidelines">{t("snav.guide")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/publish/policies">{t("snav.policies")}</Link>
            </MenuItem>
            <MenuItem sx={menuItemSx} onClick={handleMenuClose}>
              <Link href="/publish/open-access">{t("snav.openaccess")}</Link>
            </MenuItem>
          </Menu>
        </Box>

        {/* Submit Your Paper */}
        <Box>
          <Link href="/journals" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            {t("snav.submit")}
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default SecondaryNavbar;
