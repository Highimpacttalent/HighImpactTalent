import React from "react";
import { Box, Stack, Typography, Chip, Button } from "@mui/material";
import moment from "moment";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  CurrencyRupee,
} from "@mui/icons-material";

function JobDesc({ job }) {
  console.log(job);
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Box
          sx={{
            width: { md: "70%", lg: "70%", xs: "100%", sm: "100%" },
            border: "1px solid #00000040",
            p: 4,
            borderRadius: 4,
          }}
        >
          <Box>
            <Typography
              sx={{ fontFamily: "Satoshi", fontWeight: 700, color: "#24252C" }}
            >
              Job Description:
            </Typography>
            <Typography sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}>
              {job.jobDescription}
            </Typography>
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 700,
                color: "#24252C",
                mt: 2,
              }}
            >
              Requirements:
            </Typography>
            {Array.isArray(job.requirements) && job.requirements.length > 0 ? (
              job.requirements.map((req, index) => (
                <Typography
                  key={index}
                  sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}
                >
                  {index + 1}. {req}
                </Typography>
              ))
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                  fontFamily: "Satoshi",
                }}
              >
                No specific requirements provided.
              </Typography>
            )}
            <Typography
              sx={{
                fontFamily: "Satoshi",
                fontWeight: 700,
                color: "#24252C",
                mt: 2,
              }}
            >
              Qualifications:
            </Typography>
          </Box>
          {Array.isArray(job.qualifications) &&
          job.qualifications.length > 0 ? (
            job.qualifications.map((req, index) => (
              <Typography
                key={index}
                sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}
              >
                {index + 1}. {req}
              </Typography>
            ))
          ) : (
            <Typography
              sx={{
                mt: 1,
                color: "#9CA3AF",
                fontStyle: "italic",
                fontFamily: "Satoshi",
              }}
            >
              No qualification criteria provided.
            </Typography>
          )}
          <Typography
            sx={{
              fontFamily: "Satoshi",
              fontWeight: 700,
              color: "#24252C",
              mt: 2,
            }}
          >
            Skills:
          </Typography>
          <Typography
            sx={{
              mt: 1,
              color: "#474E68",
              fontFamily: "Satoshi",
            }}
          >
            {Array.isArray(job.skills) && job.skills.length > 0 ? (
              <Typography
                sx={{ mt: 1, color: "#474E68", fontFamily: "Satoshi" }}
              >
                {job.skills.join(", ")}
              </Typography>
            ) : (
              <Typography
                sx={{
                  mt: 1,
                  color: "#9CA3AF",
                  fontStyle: "italic",
                  fontFamily: "Satoshi",
                }}
              >
                No skills provided.
              </Typography>
            )}
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

export default JobDesc;
