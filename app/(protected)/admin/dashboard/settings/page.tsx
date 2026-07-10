"use client";

import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Switch, 
  FormControlLabel, 
  Divider,
  Button,
  TextField
} from "@mui/material";
import { Settings as SettingsIcon, Save } from "@mui/icons-material";

import { useLanguage } from "@/lib/LanguageContext";

const Settings = () => {
  const { t } = useLanguage();
  const [requireOrcid, setRequireOrcid] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("ist-require-orcid") === "true";
      setRequireOrcid(stored);
    }
  }, []);

  const handleOrcidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRequireOrcid(checked);
    if (typeof window !== "undefined") {
      localStorage.setItem("ist-require-orcid", String(checked));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: '#004b23' }}>
          {t("settings.title")}
        </Typography>
        <Button variant="contained" startIcon={<Save />} sx={{ bgcolor: '#004b23', borderRadius: 2 }}>
          {t("settings.save")}
        </Button>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              {t("settings.general")}
            </Typography>
            <TextField fullWidth label={t("settings.name")} defaultValue="International Scientific and Technological Journal" sx={{ mb: 3 }} />
            <TextField fullWidth label={t("settings.email")} defaultValue="info@istjournal.com" sx={{ mb: 3 }} />
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
              {t("settings.notifications")}
            </Typography>
            <FormControlLabel control={<Switch defaultChecked color="success" />} label={t("settings.emailnotify")} />
            <FormControlLabel control={<Switch defaultChecked color="success" />} label={t("settings.weeklyreport")} />
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              {t("settings.rules")}
            </Typography>
            <FormControlLabel control={<Switch defaultChecked color="success" />} label={t("settings.enablesubmissions")} />
            <FormControlLabel control={<Switch checked={requireOrcid} onChange={handleOrcidChange} color="success" />} label={t("settings.requireorcid")} />
            <FormControlLabel control={<Switch defaultChecked color="success" />} label={t("settings.plagiarism")} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Settings;
