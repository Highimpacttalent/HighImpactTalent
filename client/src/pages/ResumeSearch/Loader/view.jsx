// PremiumLoader.jsx
import React, { useEffect, useRef, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

const PremiumLoader = ({ loading }) => {
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState("");

  const loadingMessages = [
  { percentage: 10, message: "Identifying required skills & experience..." },
  { percentage: 25, message: "Searching the candidate database..." },
  { percentage: 50, message: "Scoring candidates against role criteria..." },
  { percentage: 75, message: "Enriching profiles with signals & endorsements..." },
  { percentage: 90, message: "Building ranked shortlist..." },
];


  // refs to hold timers so we can clear them on unmount / when loading turns false
  const timersRef = useRef({ progress: null, next: null });

  useEffect(() => {
    const clearAll = () => {
      if (timersRef.current.progress) {
        clearInterval(timersRef.current.progress);
        timersRef.current.progress = null;
      }
      if (timersRef.current.next) {
        clearTimeout(timersRef.current.next);
        timersRef.current.next = null;
      }
    };

    if (!loading) {
      // if loader turned off, clear timers and reset UI
      clearAll();
      setProgress(0);
      setCurrentMessage("");
      return;
    }

    // start staged progress/message sequence
    let idx = 0;

    const runStage = () => {
      if (idx >= loadingMessages.length) return;

      const target = loadingMessages[idx].percentage;
      const message = loadingMessages[idx].message;

      // clear any previous progress timer
      if (timersRef.current.progress) {
        clearInterval(timersRef.current.progress);
        timersRef.current.progress = null;
      }

      // animate progress smoothly up to `target`
      timersRef.current.progress = setInterval(() => {
        setProgress((prev) => {
          if (prev >= target) {
            clearInterval(timersRef.current.progress);
            timersRef.current.progress = null;
            setCurrentMessage(message);

            idx += 1;
            // small delay before next stage starts
            timersRef.current.next = setTimeout(() => {
              runStage();
            }, 900);

            return target;
          }
          return prev + 1;
        });
      }, 25);
    };

    runStage();

    return () => {
      clearAll();
    };
    // only re-run when `loading` changes
  }, [loading]);

  return (
    <Modal
      open={!!loading}
      onClose={() => {}}
      disableEscapeKeyDown
      BackdropProps={{
        style: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          backdropFilter: "blur(8px)",
        },
        // prevent backdrop click from closing; parent controls via `loading`
        onClick: (e) => e.stopPropagation(),
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,1) 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          p: 6,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "90%",
          maxWidth: 500,
          border: "1px solid rgba(255, 255, 255, 0.2)",
        }}
      >
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
            }}
          >
            Parsing your search prompt
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748b", fontWeight: 500 }}>
            Our AI is analyzing your requirements to find the best candidates
          </Typography>
        </Box>

        {/* Progress */}
        <Box sx={{ width: "100%", mb: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: "#1976d2",
                fontSize: "2.5rem",
              }}
            >
              {progress}%
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                bgcolor: "#e3f2fd",
                px: 2,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: "#1976d2",
                  mr: 1,
                  animation: "pulse 2s infinite",
                }}
              />
              <Typography variant="body2" sx={{ color: "#1976d2", fontWeight: 600 }}>
                LIVE
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: 12,
              bgcolor: "#e5e7eb",
              borderRadius: 6,
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: `${progress}%`,
                height: "100%",
                background:
                  "linear-gradient(90deg, #1976d2 0%, #42a5f5 50%, #1976d2 100%)",
                borderRadius: 6,
                transition: "width 0.3s ease-in-out",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)",
                  animation: "shimmer 2s infinite",
                },
              }}
            />
          </Box>
        </Box>

        {/* Message */}
        <motion.div
          key={currentMessage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", minHeight: 60 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1e293b",
              fontWeight: 600,
              fontSize: "1.1rem",
              lineHeight: 1.4,
            }}
          >
            {currentMessage}
          </Typography>
        </motion.div>

        {/* Footer */}
        <Box
          sx={{
            mt: 3,
            display: "flex",
            alignItems: "center",
            gap: 1,
            opacity: 0.7,
          }}
        >
          <Box
            sx={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              bgcolor: "#22c55e",
            }}
          />
          <Typography variant="caption" sx={{ color: "#64748b", fontWeight: 500 }}>
            Secured with enterprise-grade encryption
          </Typography>
        </Box>

        {/* Keyframes */}
        <style jsx>{`
          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
          @keyframes shimmer {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(100%);
            }
          }
        `}</style>
      </Box>
    </Modal>
  );
};

export default PremiumLoader;
