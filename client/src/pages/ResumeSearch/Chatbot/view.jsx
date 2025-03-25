import React, { useState,useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  OutlinedInput,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { Tooltip, Fab } from "@mui/material";
import { skillsList } from "../../../assets/mock";

const Chatbot = ({ setFilters }) => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Welcome! Let’s find the perfect candidate for your role. What position are you hiring for?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(1);
  const [responses, setResponses] = useState({});
  const [dropdownValue, setDropdownValue] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSend = () => {
    if (input.trim() === "" && dropdownValue === "" && selectedSkills.length === 0) return;

    const userResponse = step === 3.1 ? selectedSkills.join(", ") : dropdownValue || input;
    const newMessages = [...messages, { text: userResponse, sender: "user" }];
    setMessages(newMessages);
    handleBotResponse(userResponse, newMessages);
    setInput("");
    setDropdownValue("");
    setSelectedSkills([]);
  };

  const handleBotResponse = (userInput, newMessages) => {
    let nextStep = step;
    let botMessage = "";
    const newResponses = { ...responses };

    switch (step) {
      case 1:
          newResponses.role = userInput;
          botMessage = "Great! How many years of experience should the candidate have?";
          nextStep = 1.5;
          break;

      case 1.5:
          newResponses.experience = userInput;
          botMessage = "What skills should the candidate have?";
          nextStep = 2;
          break;

      case 2:
          newResponses.skills = selectedSkills; // Handling multiple skills
          botMessage = "Would you prefer candidates from top-tier institutes and renowned companies?";
          nextStep = 3;
          break;

      case 3:
          newResponses.topInstituteAndCompany = userInput === "Yes";
          botMessage = "Are you looking for candidates from specific companies?";
          nextStep = 4;
          break;

      case 4:
          if (userInput === "Yes") {
              botMessage = "Give me a list of companies the candidate should have worked at (separated by commas).";
              nextStep = 4.2;
          } else {
              botMessage = "Are you looking for candidates from specific institutes or colleges?";
              nextStep = 4.1;
          }
          break;

      case 4.2:
          newResponses.companies = userInput.split(",").map(company => company.trim());
          botMessage = "Are you looking for candidates from specific institutes or colleges?";
          nextStep = 4.1;
          break;

      case 4.1:
          if (userInput === "Yes") {
              botMessage = "Tell me the names of the institutes the candidate should have graduated from.";
              nextStep = 4.11;
          } else {
              botMessage = "Do you want any specific batch passout from an institute?";
              nextStep = 4.14;
          }
          break;

      case 4.11:
          newResponses.instituteName = userInput // Fixed `.split` usage
          botMessage = "Do you want candidates from a specific graduation batch?";
          nextStep = 4.14;
          break;

      case 4.14:
          if (userInput === "Yes") {
              botMessage = "Tell me the batch year of the candidate you are looking for.";
              nextStep = 4.13;
          } else {
              botMessage = "Would you like to filter candidates who have worked only as consultants?";
              nextStep = 10;
          }
          break;
        

      case 4.13:
          newResponses.batch = userInput;
          botMessage = "Would you like to filter candidates who have worked only as consultants?";
          nextStep = 10;
          break;

      case 10:
          newResponses.consultantOnly = userInput === "Yes";
          botMessage = "Do you want candidates from a specific company who has served for a particular tenure there?";
          nextStep = 10.1;
          break;

      case 10.1:
        if(userInput === "Yes"){
          botMessage="Please tell the company name?";
          nextStep=10.2;
        }
        else{
          botMessage = "Thank you! We have all the necessary details. Searching for the best candidates now!";
          nextStep = 11;
        }
        break;
      
      case 10.2:
        newResponses.company = userInput;
        botMessage = "How many years of experience should they have in this company?";
        nextStep = 10.3;
        break;

      case 10.3:
        newResponses.tenure = userInput;
        botMessage = "Thank you! We have all the necessary details. Searching for the best candidates";
        nextStep = 11; 
        break;

      case 11:
        botMessage = "All Filters Applied";
        nextStep = 12;
        break;

      default:
          botMessage = "Would you like to start a new search?";
          nextStep = 1;
          break;
  }

    setResponses(newResponses);
    setStep(nextStep);
    setMessages([...newMessages, { text: botMessage, sender: "bot" }]);
    console.log(responses)
};

// Apply filters automaticzally when reaching step 10
useEffect(() => {
  if (step === 11) {
    setFilters((prevFilters) => ({
      ...prevFilters,
      jobRoles: responses.role || prevFilters.jobRoles,
      exp: responses.experience || prevFilters.exp,
      skills: responses.skills.length > 0 ? responses.skills : prevFilters.skills,
      topCompany: responses.topInstituteAndCompany,
      topInstitutes: responses.topInstituteAndCompany,
      companiesWorkedAt: responses.companies || prevFilters.companiesWorkedAt,
      workExpCompany: responses.company === "" ? "" : responses.company,
      minWorkExp: responses.tenure=== ""?"":responses.tenure,
      yearOfPassout: responses.batch || "",
      isConsultant: responses.consultantOnly || false,
      instituteName: responses.instituteName === "" ? "" : responses.instituteName,
    }));

    setOpen(false);
  }
}, [step, responses, setFilters]);

  return (
    <>
      <IconButton sx={{ background: "linear-gradient(45deg, #841a7b, #ff1493, #00ffff)", color: "white" }} onClick={() => setOpen(true)}>
      <Tooltip title="Chat Assistant">
    <ChatBubbleOutlineIcon />
  </Tooltip>
      </IconButton>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
          AI Recruitment Assistant
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <Paper sx={{ maxHeight: 300, overflowY: "auto", padding: 2, backgroundColor: "#f5f5f5" }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ textAlign: msg.sender === "user" ? "right" : "left", marginBottom: "8px" }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "12px",
                    backgroundColor: msg.sender === "user" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Typography>
              </Box>
            ))}
          </Paper>
        </DialogContent>

        <DialogActions sx={{ padding: "10px" }}>
  {[
    3, 4, 4.1, 4.14, 10, 10.1
  ].includes(step) ? (
    <FormControl fullWidth>
      <InputLabel>Choose an option</InputLabel>
      <Select value={dropdownValue} onChange={(e) => setDropdownValue(e.target.value)}>
        {["Yes", "No"].map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : step === 2 ? (
    <FormControl fullWidth>
      <InputLabel>Select Skills</InputLabel>
      <Select
        multiple
        value={selectedSkills}
        onChange={(e) => setSelectedSkills(e.target.value)}
        input={<OutlinedInput label="Select Skills" />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((skill) => (
              <Chip key={skill} label={skill} />
            ))}
          </Box>
        )}
      >
        {skillsList.map((skill, index) => (
          <MenuItem key={index} value={skill}>
            {skill}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  ) : (
    <TextField fullWidth variant="outlined" placeholder="Type your response..." value={input} onChange={(e) => setInput(e.target.value)} />
  )}
  <Button onClick={handleSend} variant="contained" color="primary" endIcon={<SendIcon />}>Send</Button>
</DialogActions>

      </Dialog>
    </>
  );
};

export default Chatbot;