"use client";
import { Container, Divider, Typography } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import { Theme, useTheme } from "@mui/material/styles";
import { SelectChangeEvent } from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import MenuItem from "@mui/material/MenuItem";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useRouter } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";
import { useSearchParams } from "next/navigation";
import Select from "react-select";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  { value: "computer_science", label: "Computer Science" },
  { value: "data_analysis", label: "Data Analysis" },
  { value: "engineering", label: "Engineering" },
  { value: "mathematics", label: "Mathematics" },
  { value: "artificial_intelligence", label: "Artificial Intelligence" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "environmental_science", label: "Environmental Science" },
  { value: "medicine", label: "Medicine" },
  { value: "economics", label: "Economics" },
  { value: "linguistics", label: "Linguistics" },
];

type EditorRegisterProps = {
  fixedRole?: "EDITOR" | "ASSOCIATE_EDITOR";
  title?: string;
};

const EditorRegister = ({ fixedRole, title }: EditorRegisterProps) => {
  const params = useSearchParams();
  const router = useRouter();
  const [selectedKeywords, setSelectedValue] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    fullName: "",
    university: "",
    qualification: "",
    expertised: [],
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    description: "",
    Photo: "",
    checked: false,
  });

  const [error, setError] = useState({
    fullName: false,
    university: false,
    qualification: false,
    email: false,
    password: false,
    contactNumber: false,
  });

  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const regiterEditor = async () => {
    const expertiseString = formData.expertised.join(",");
    const role = fixedRole || params.get("role")?.toUpperCase();
    const userData = {
      name: formData?.fullName,
      email: formData?.email,
      password: formData?.password,
      role,
      university: formData?.university,
      qualification: formData?.qualification,
      areaOfExpertise: selectedKeywords.toString(),
      Status: "ACTIVE",
    };

    try {
      const response = await axios.post("/api/register", userData);
      if (response.status === 200) {
        Toast.fire({
          icon: "success",
          title: `${(role || "User").split("_").join(" ")} Registered Successfully`,
        });
        // router.push("/login");
      }
    } catch (error) {
      console.error("API request error:", error);
      Toast.fire({
        icon: "error",
        title: "Something went wrong!",
      });
    }
  };

  const handleClick = (e: any) => {
    e.preventDefault();

    if (formData?.fullName.trim() === "") {
      setError((prev) => ({
        ...prev,
        fullName: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        fullName: false,
      }));
    }

    if (formData?.university.trim() === "") {
      setError((prev) => ({
        ...prev,
        university: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        university: false,
      }));
    }

    if (formData?.qualification.trim() === "") {
      setError((prev) => ({
        ...prev,
        qualification: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        qualification: false,
      }));
    }

    if (formData?.email.trim() === "") {
      setError((prev) => ({
        ...prev,
        email: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        email: false,
      }));
    }

    if (formData?.password.trim() === "") {
      setError((prev) => ({
        ...prev,
        password: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        password: false,
      }));
    }

    if (formData?.contactNumber.trim() === "") {
      setError((prev) => ({
        ...prev,
        contactNumber: true,
      }));
    } else {
      setError((prev) => ({
        ...prev,
        contactNumber: false,
      }));
    }

    if (formData?.confirmPassword !== formData?.password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }

    if (
      error.fullName ||
      error.email ||
      error.qualification ||
      error.password ||
      error.university ||
      confirmPasswordError
    ) {
      // Toast.fire({
      //   icon: "error",
      //   title: "Please Fill the required fields",
      // });
      return;
    }

    if (
      formData?.fullName === "" ||
      formData?.email === "" ||
      formData?.password === "" ||
      formData?.university === "" ||
      formData?.qualification === "" ||
      formData?.confirmPassword === ""
    ) {
      Toast.fire({
        icon: "error",
        title: "Please Fill the required fields",
      });
      return;
    }
    regiterEditor();

    setFormData((prevFormData) => ({
      ...prevFormData,
      fullName: "",
      university: "",
      qualification: "",
      expertised: [],
      email: "",
      password: "",
      confirmPassword: "",
      contactNumber: "",
      description: "",
      Photo: "",
      checked: false,
    }));
    setSelectedValue([]);
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setFormData((prevAnswer) => ({
      ...prevAnswer,
      [property]: event.target.value,
    }));
  };

  const handleChange = (e: any) => {
    setSelectedValue(Array.isArray(e) ? e.map((x) => x.value) : []);
  };

  const handleRegisterClick = () => {
    router.back();
  };

  return (
    <Container>
      <button
        className="bg-[#004b23] text-[#fff] w-[150px] mt-7 px-4 py-3 font-[inherit] rounded-md font-medium hover:text-[#004b23] hover:bg-[#ffff] hover:font-bold hover:border border-[#004b23] transition-all duration-200 ease-linear flex gap-2 items-center justify-center"
        onClick={handleRegisterClick}
      >
        <KeyboardBackspaceIcon />
        Back
      </button>
      <Paper
        elevation={3}
        sx={{
          marginBlock: "20px",
          paddingBlock: "20px",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Box
          component={"form"}
          sx={{
            paddingTop: "10px",
            paddingInline: "20px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h2"
            sx={{
              color: "#004B23",
              fontSize: "25px",
              fontWeight: 700,
              fontFamily: "inherit",
              textShadow: "0px 2px 0px #70E000",
              marginBlock: "20px",
              textAlign: "center",
            }}
          >
            {title || `${params.get("role")?.split("_").join(" ")} Registration Form`}
          </Typography>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Full Name <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                required
                type="text"
                name="project title"
                value={formData?.fullName}
                className={
                  error?.fullName
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                placeholder="Enter  Full Name"
                onChange={(event) => handleInputChange(event, "fullName")}
              />
              {error?.fullName && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  This Field is Required
                </p>
              )}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              University <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                type="text"
                required
                className={
                  error?.university
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                value={formData?.university}
                onChange={(event) => handleInputChange(event, "university")}
                name="university"
                placeholder="Enter University"
              />
              {error?.university && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  This Field is Required
                </p>
              )}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Qualification <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                required
                type="text"
                name="project title"
                value={formData?.qualification}
                className={
                  error?.qualification
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                placeholder="Enter Qualification"
                onChange={(event) => handleInputChange(event, "qualification")}
              />
              {error?.qualification && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  This Field is Required
                </p>
              )}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Areas of Expertise
            </FormLabel>
            <Box>
              <FormControl sx={{ m: 1, width: 300 }}>
                <Select
                  // defaultValue={[names[2], keywordsFilter[3]]}
                  isMulti
                  name="colors"
                  options={names}
                  className="basic-multi-select sm:w-[200px] md:w-[300px]"
                  classNamePrefix="select"
                  value={names.filter((obj) =>
                    selectedKeywords.includes(obj.value)
                  )}
                  onChange={handleChange}
                />
              </FormControl>
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Email Address <span style={{ color: "red" }}>*</span>
            </FormLabel>

            <Box>
              <input
                required
                type="email"
                name="email"
                value={formData?.email}
                className={
                  error?.email
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                placeholder="Enter Email Address"
                onChange={(event) => handleInputChange(event, "email")}
              />
              {error?.email && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  This Field is Required
                </p>
              )}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Password <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                required
                type="password"
                name="password"
                value={formData?.password}
                className={
                  error?.password
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                placeholder="Enter Password"
                onChange={(event) => handleInputChange(event, "password")}
              />
              {error?.password && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  This Field is Required
                </p>
              )}
            </Box>
          </FormControl>

          <FormControl
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: "30px",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <FormLabel sx={{ fontSize: "16px", width: "310px", color: "#000" }}>
              Confirm Password <span style={{ color: "red" }}>*</span>
            </FormLabel>
            <Box>
              <input
                required
                type="password"
                name="confirmPassword"
                value={formData?.confirmPassword}
                className={
                  confirmPasswordError
                    ? "outline-none border py-3 px-3 w-[300px] rounded-lg border-[red]"
                    : "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                placeholder="Enter Confirm Password"
                onChange={(event) =>
                  handleInputChange(event, "confirmPassword")
                }
              />

              {confirmPasswordError && (
                <p style={{ marginTop: "5px", fontSize: "13px", color: "red" }}>
                  Password Not Match
                </p>
              )}
            </Box>
          </FormControl>

          <Button
            type="submit"
            onClick={handleClick}
            sx={{
              color: "#000",
              backgroundColor: "green",
              border: "2px solid #006400",
              margin: "0 auto",
              padding: "10px 20px",
              alignSelf: "center",
              transition: "all 0.4s ease",
              ":hover": {
                backgroundColor: "#006400",
                color: "#fff",
              },
            }}
          >
            Register
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default EditorRegister;
