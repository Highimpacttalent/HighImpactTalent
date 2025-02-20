import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const RecruiterSchedule = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    pay: "",
    additionalInfo: "",
    sendText: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      ...formData,
      date: dayjs(date).format("YYYY-MM-DD"),
      time: dayjs(time).format("HH:mm"),
    };

    try {
      const response = await fetch("https://highimpacttalent.onrender.com/api-v1/sendmail/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessModalOpen(true);
        setTimeout(() => {
          setSuccessModalOpen(false); 
          navigate("/"); 
        }, 2000);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to schedule meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          mt: 5,
          mb: 5,
          borderRadius: 3,
          backgroundColor: "#f8faff",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        {step === 1 && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold", color: "#1976D2" }}
            >
              Select Date and Time Slot
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <DatePicker label="Select Date" value={date} onChange={setDate} sx={{ width: "100%" }} />
                </Grid>
                <Grid item xs={12}>
                  <TimePicker label="Select Time" value={time} onChange={setTime} sx={{ width: "100%" }} />
                </Grid>
              </Grid>
            </LocalizationProvider>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#1976D2",
                "&:hover": { backgroundColor: "#1565C0" },
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              fullWidth
              onClick={() => setStep(2)}
              disabled={!date || !time}
            >
              Continue
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ textAlign: "center", fontWeight: "bold", color: "#1976D2" }}
            >
              Enter Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField label="Name" name="name" fullWidth required onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" name="email" type="email" fullWidth required onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="What role are you looking to hire?" name="role" fullWidth onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="How much are you ready to pay?" name="pay" fullWidth required onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Additional Info" name="additionalInfo" fullWidth multiline rows={3} onChange={handleChange} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Contact Number" name="sendText" fullWidth onChange={handleChange} />
              </Grid>
            </Grid>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#1976D2",
                "&:hover": { backgroundColor: "#1565C0" },
                borderRadius: "8px",
                fontWeight: "bold",
              }}
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Schedule Event"}
            </Button>
          </>
        )}
      </Paper>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onClose={() => setSuccessModalOpen(false)}>
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold", color: "#4CAF50" }}>
          Meeting Scheduled Successfully!
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <CheckCircleIcon sx={{ fontSize: 80, color: "#4CAF50" }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Your meeting has been scheduled successfully.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setSuccessModalOpen(false)}
            sx={{ backgroundColor: "#4CAF50", color: "white", "&:hover": { backgroundColor: "#388E3C" } }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RecruiterSchedule;
