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

const AppliedJobCard = ({ job,flag = false,enable = false }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const mobileView = (
    <Card sx={{ 
      maxWidth: 400, 
      display: "flex", 
      flexDirection: "column", 
      height: "100%", 
      boxShadow: "0px 0px 4px 0px #00000040", 
      borderRadius: 2, 
    }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Job Title */}
        <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#404258" ,mb:1.5,fontFamily:"Poppins"}} color="#404258">
          {job?.job?.jobTitle}
        </Typography>
        {/* Company Name & Like Button */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Business color= "#404258" />
            <Typography variant="subtitle1" fontWeight={600} color="#404258" fontFamily="Poppins">
              {job?.company?.name}
            </Typography>
          </Box>
          
        </Box>

        {/* Job Details */}
        <Box sx={{ mb: 2 ,display:"flex",flexWrap:"wrap"}} gap={1}>
          <Box sx={{display:"flex"}} gap={0.5}>
            <Chip
              icon={<LocationOnOutlined sx={{color:"#474E68"}}/>}
              label={job?.job?.jobLocation}
              variant="contained" 
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
              label={`${job?.job?.experience}+ years experience`}
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            </Box>
            <Chip
              icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
              label={
                job?.job?.salaryConfidential
                  ? "Confidential"
                  : `${job.job?.salary.toLocaleString()} (${job.job?.salaryCategory})`
              }
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
           </Box>

        {/* Job Description */}
        <Typography 
          variant="body2" 
          color="#474E68" 
          sx={{ flexGrow: 1, overflow: "hidden", textOverflow: "ellipsis", height: 40 }}>
          {job.job?.jobDescription !== "- " ? job?.job?.jobDescription : "No description Provided"}
        </Typography>
      </CardContent>

      {/* Fixed Bottom Section */}
      <CardActions sx={{ display: "flex", justifyContent: "space-between", pl: 2,pr:2}}>
        <Typography variant="caption" color="text.secondary">
          Posted {moment(job?.job?.createdAt).fromNow()}
        </Typography>
      </CardActions>
    </Card>
  );

  const desktopView = (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        borderColor:"#75758",
        boxShadow: "0px 0px 4px 0px #00000040",
        borderRadius: 2,
        p:0.5
      }}
    >
      <CardContent
        sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}
      >
        {/* Job Title */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: "#404258",fontFamily:"Poppins" }}>
            {job?.job?.jobTitle}
          </Typography>

          <Box sx={{display:"flex",alignItems:"center"}}>

          <Typography variant="caption" color="#808195" fontSize={14}>
            Posted {moment(job?.job?.createdAt).fromNow()}
          </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={1}
        >
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{ mb: 1, mt: 0.5 }}
          >
            <Business color="primary" sx={{ color: "#404258" }} />
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: "#404258",fontFamily:"Poppins" }}>
              {job?.company?.name}
            </Typography>
          </Box>
        </Box>

        {/* Job Details */}
        <Box sx={{ mb: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            <Chip
              icon={<LocationOnOutlined sx={{color:"#474E68"}}/>}
              label={job?.job?.jobLocation}
              variant="contained" 
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
              label={`${job?.job?.experience}+ years experience`}
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
            <Chip
              icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
              label={
                job?.job?.salaryConfidential
                  ? "Confidential"
                  : `${job?.job?.salary.toLocaleString()} (${job?.job?.salaryCategory})`
              }
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400"}}
            />
          </Stack>
        </Box>

        {/* Job Description */}
        <Typography
          variant="body2"
          color="#474E68"
          sx={{
            flexGrow: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2, // Adjust line limit
            WebkitBoxOrient: "vertical",
          }}
        >
          {job?.job?.jobDescription && job?.job?.jobDescription !== "- "
            ? job?.job?.jobDescription.split(" ").slice(0, 150).join(" ") + "..."
            : "No description provided"}
        </Typography>
      </CardContent>
    </Card>
  );

  return <Box>{isMobile || flag ? mobileView : desktopView}</Box>;
};

export default AppliedJobCard;