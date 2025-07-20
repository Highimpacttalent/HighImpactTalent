import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

const ScreeningModal = ({ open, onClose, answers }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4, p: 2 },
      }}
    >
      <DialogTitle
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: "#1e293b",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <QuestionAnswerIcon sx={{ color: "#6366f1" }} />
          Screening Responses
        </Box>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent dividers>
        {answers?.length > 0 ? (
          answers.map((item, index) => (
            <Box key={item._id} sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 600,
                  mb: 0.5,
                  color: "#374151",
                }}
              >
                Q{index + 1}. {item.question}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "Satoshi, sans-serif",
                  fontWeight: 500,
                  color: "#4b5563",
                  ml: 1,
                }}
              >
                ➤ {item.answerText}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{
              fontFamily: "Satoshi, sans-serif",
              color: "#6b7280",
              textAlign: "center",
              mt: 4,
            }}
          >
            No screening responses submitted.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#6366f1",
            textTransform: "none",
            fontFamily: "Satoshi, sans-serif",
            fontWeight: 600,
            px: 4,
            "&:hover": { backgroundColor: "#4f46e5" },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScreeningModal;
