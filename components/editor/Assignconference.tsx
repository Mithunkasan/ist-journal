"use client";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
// import { DatePicker } from "@mui/x-date-pickers";
// import { Fonts } from "@crema/constants/AppEnums";
import { Dispatch, SetStateAction, useState } from "react";
import { ChangeEvent } from "react";
import dayjs from "dayjs";
import Box from "@mui/material/Box";
import { InputAdornment, OutlinedInput } from "@mui/material";

type ConferenceType = {
  modalOpen: boolean;
  modalClose?: any;
};

function AddUpcomingConference({ modalClose, modalOpen }: ConferenceType) {
  const [open, setOpen] = useState(modalOpen);
  const [modalAnswers, setModalAnswers] = useState({
    medicationName: "",
    duration: "",
    morning: "",
    afternoon: "",
    evening: "",
    night: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
    // getId(0);
  };
  const handleClose = () => {
    setOpen(false);
    modalClose(false);

    setModalAnswers({
      medicationName: "",
      duration: "",
      morning: "",
      afternoon: "",
      evening: "",
      night: "",
    });
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    property: string
  ) => {
    setModalAnswers((prevAnswer) => ({
      ...prevAnswer,
      [property]: event.target.value,
    }));
  };

  // const handleDateChange = (date: string | null, property: string) => {
  //   if (date !== null) {
  //     const dayjsDate = dayjs(date);
  //     const isoFormattedDate = dayjsDate.toISOString();

  //     setModalAnswers((prevAnswers) => ({
  //       ...prevAnswers,
  //       [property]: isoFormattedDate,
  //     }));
  //   }
  // };

  // const getMedicationValue = () => {
  //   setOpen(false);
  //   const morningAsNumber = parseFloat(modalAnswers.morning);
  //   const afrernoonAsNumber = parseFloat(modalAnswers.afternoon);
  //   const eveningAsNumber = parseFloat(modalAnswers.evening);
  //   const nightAsNumber = parseFloat(modalAnswers.night);

  //   // Check if the parsed duration is a valid number
  //   if (!isNaN(morningAsNumber)) {
  //     // getModalAnswers({
  //     //   medicationName: modalAnswers.medicationName,
  //     //   duration: modalAnswers.duration,
  //     //   morning: morningAsNumber,
  //     //   afternoon: afrernoonAsNumber,
  //     //   evening: eveningAsNumber,
  //     //   night: nightAsNumber,
  //     // } as {
  //     //   medicationName: string;
  //     //   duration: string;
  //     //   morning: number;
  //     //   afternoon: number;
  //     //   evening: number;
  //     //   night: number;
  //     // });

  //     // SetFlagCalled(true);

  //     setModalAnswers({
  //       medicationName: "",
  //       duration: "",
  //       morning: "",
  //       afternoon: "",
  //       evening: "",
  //       night: "",
  //     });
  //   } else {
  //     console.error("Invalid duration value:", modalAnswers.duration);
  //   }
  // };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      // getMedicationValue();
    }
  };

  return (
    <>
      {/* <Button
        variant="outlined"
        onClick={handleClickOpen}
        sx={{ fontSize: "20px" }}
      >
        Medication Details
      </Button> */}
      <Dialog open={open} onClose={handleClose}>
        <DialogContent
          sx={{
            overflowX: "hidden !important",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <DialogTitle
            sx={{
              fontSize: "22px",
              fontWeight: 700,
              marginTop: 5,
              width: 500,
              textAlign: "center",
              color: "#004B23",

              "@media(max-width:576px)": {
                fontSize: "16px",
                textAlign: "initial",
              },
            }}
          >
            Add Confereneces
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              right: 1,
              top: 1,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Box component="form">
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                Conference Title
              </FormLabel>
              <TextField
                autoFocus
                margin="dense"
                type="text"
                variant="outlined"
                value={modalAnswers.medicationName}
                placeholder="Insuline"
                onChange={(event) => handleInputChange(event, "medicationName")}
              />
            </FormControl>

            {/* <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                How often do you take medication?
              </FormLabel>

              <DatePicker
                value={modalAnswers.duration}
                onChange={(event) => handleDateChange(event, "duration")}
              />
            </FormControl> */}

            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "30px",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                Conference Location
              </FormLabel>
              <OutlinedInput
                value={modalAnswers.morning}
                margin="dense"
                type="text"
                placeholder="Ex: 3 mg"
                onChange={(event) => handleInputChange(event, "morning")}
              />
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
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                Conference Description
              </FormLabel>

              {/* <OutlinedInput
                value={modalAnswers.afternoon}
                margin="dense"
                type="text"
                placeholder="Ex: 3 mg"
                onChange={(event) => handleInputChange(event, "afternoon")}
              /> */}
              <textarea
                required
                className={
                  "outline-none border py-3 px-3 w-[300px] rounded-lg border-[#d2d2d2]"
                }
                value={modalAnswers.afternoon}
                onChange={(event) => handleInputChange(event, "afternoon")}
                name="abstract"
                rows={4}
                cols={50}
                placeholder="Enter Your Abstract Here..."
              />
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
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                Conference Details
              </FormLabel>

              <OutlinedInput
                value={modalAnswers.evening}
                margin="dense"
                type="text"
                placeholder="Ex: 3 mg"
                onChange={(event) => handleInputChange(event, "evening")}
              />
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
              <FormLabel sx={{ fontSize: "18px", width: "310px" }}>
                What is the dosage of the medication in the night?
              </FormLabel>

              <OutlinedInput
                value={modalAnswers.night}
                margin="dense"
                type="text"
                placeholder="Ex: 3 mg"
                endAdornment={
                  <InputAdornment position="end">mg</InputAdornment>
                }
                onChange={(event) => handleInputChange(event, "night")}
              />
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{ fontSize: "18px", margin: "0 auto", marginBottom: "15px" }}
            // onClick={getMedicationValue}
            variant="outlined"
            onKeyPress={handleKeyPress}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AddUpcomingConference;
