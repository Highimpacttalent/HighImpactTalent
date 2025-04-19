import moment from "moment";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  LocationOnOutlined,
  WorkOutlineOutlined,
  Business,
  CurrencyRupee,
} from "@mui/icons-material";

const AppliedJobMenuCard = ({ job, flag = false, enable = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const getStatusColor = (status) => {
    switch (status) {
      case "APPLIED":
        return "#2196f3"; // Blue
      case "APPLICATION VIEWED":
        return "#00bcd4"; // Cyan
      case "SHORTLISTED":
        return "#ffc107"; // Amber
      case "INTERVIEWING":
        return "#673ab7"; // Deep Purple
      case "HIRED":
        return "#4caf50"; // Green
      case "NOT PROGRESSING":
        return "#f44336"; // Red
      default:
        return "#9e9e9e"; // Grey
    }
  };
  

  const JobCard = (
    <Box
      sx={{
        maxWidth: 400,
        display: "flex",
        flexDirection: "column",
        border: "1px solid #00000040",
        borderRadius: 4,
        p: 0.5,
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Job Title */}
        <Typography
          fontWeight={600}
          gutterBottom
          sx={{ color: "#24252C", fontFamily: "Poppins", fontSize: "18px" }}
        >
          {job?.job?.jobTitle}
        </Typography>
        {/* Company Name & Like Button */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Typography
              fontWeight={500}
              gutterBottom
              sx={{
                color: "#24252C",
                mb: 1.5,
                fontFamily: "Poppins",
                fontSize: "16px",
              }}
            >
              {job?.company?.name}
            </Typography>
          </Box>
        </Box>

        {/* Job Details */}
        <Box sx={{  display: "flex", flexWrap: "wrap" }} gap={1}>
          <Box sx={{ display: "flex" }} gap={0.5}>
            <Chip
              icon={<LocationOnOutlined sx={{ color: "#474E68" }} />}
              label={job?.job?.jobLocation}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{ color: "#474E68" }} />}
              label={`${job?.job?.experience}+ years experience`}
              variant="contained"
              sx={{ color: "#474E68", fontWeight: "400" }}
            />
          </Box>
          <Chip
            icon={<CurrencyRupee sx={{ color: "#474E68" }} />}
            label={
              job?.job?.salaryConfidential
                ? "Confidential"
                : `${job.job?.salary.toLocaleString()} (${
                    job.job?.salaryCategory
                  })`
            }
            variant="contained"
            sx={{ color: "#474E68", fontWeight: "400" }}
          />
        </Box>
      </CardContent>

      <Box
          >
            <Typography
              fontWeight={500}
              sx={{
                color: "#24252C",
                fontFamily: "Poppins",
                fontSize: "16px",
                px:2
              }}
            >
              Current Status : <span style={{color:getStatusColor(job.status.toUpperCase()),fontWeight:"700"}}>{job.status.toUpperCase() || "Status Unknown"}</span>
            </Typography>
          </Box>

      {/* Fixed Bottom Section */}
      <CardActions
        sx={{ display: "flex", justifyContent: "space-between", pl: 2, pr: 2 }}
      >
        <Typography variant="caption" color="text.secondary">
          Posted {moment(job?.job?.createdAt).fromNow()}
        </Typography>
      </CardActions>
    </Box>
  );

  return <Box>{JobCard}</Box>;
};

export default AppliedJobMenuCard;
