"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MenuBookOutlinedIcon from "@mui/icons-material/MenuBookOutlined";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";

const SubmitPaperEntryPage = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "AUTHOR") {
      router.replace("/author/submit");
    }
  }, [router, session?.user?.role, status]);

  const handleRegisteredAuthor = () => {
    router.push("/login?callbackUrl=/author/submit");
  };

  const handleNewAuthor = () => {
    router.push("/register?role=AUTHOR&callbackUrl=/author/submit&autoLogin=1");
  };

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 80px)",
        bgcolor: "#f4f7f6",
        display: "flex",
        alignItems: "center",
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={8}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            textAlign: "center",
          }}
        >
          <MenuBookOutlinedIcon sx={{ fontSize: 48, color: "#004b23", mb: 2 }} />
          <Typography variant="h4" component="h1" sx={{ fontWeight: 800, color: "#004b23", mb: 2 }}>
            Submit Paper
          </Typography>
          <Typography sx={{ color: "#4b5563", mb: 4 }}>
            Are you a registered author?
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleRegisteredAuthor}
              sx={{ py: 1.4, bgcolor: "#004b23", borderRadius: 2, fontWeight: 700 }}
            >
              Yes, Login
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<PersonAddAltIcon />}
              onClick={handleNewAuthor}
              sx={{ py: 1.4, color: "#004b23", borderColor: "#004b23", borderRadius: 2, fontWeight: 700 }}
            >
              No, Register
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default SubmitPaperEntryPage;
