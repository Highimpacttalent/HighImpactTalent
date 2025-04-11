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
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", }}>
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border:"1px solid #00000040",
        borderRadius: 4,
        p:1
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
          <Typography fontWeight={600} gutterBottom sx={{ color: "#24252C",fontFamily:"Poppins",fontSize:"20px" }}>
            {job?.job?.jobTitle}
          </Typography>

          <Box sx={{display:"flex",alignItems:"center"}}>

          <Typography color="#808195" sx={{fontSize:"14px",fontFamily:"Poppins"}}>
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
            <Typography fontWeight={500} sx={{ color: "#474E68",fontFamily:"Poppins",fontSize:"16px" }}>
              {job?.company?.name}
            </Typography>
          </Box>
        </Box>

        {/* Job Details */}
        <Box sx={{ mb: 1}}>
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1 }}>
            <Chip
              icon={<LocationOnOutlined sx={{color:"#474E68"}}/>}
              label={job?.job?.jobLocation}
              variant="contained"
             
              sx={{color:"#474E68",fontWeight:"400",fontFamily:"Poppins"}}
            />
            <Chip
              icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
              label={`${job?.job?.experience}+ years experience`}
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400",fontFamily:"Poppins"}}
            />
            <Chip
              icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
              label={
                job?.job?.salaryConfidential
                  ? "Confidential"
                  : `${job?.job?.salary.toLocaleString()} (${job?.job?.salaryCategory})`
              }
              variant="contained"
              sx={{color:"#474E68",fontWeight:"400",fontFamily:"Poppins"}}
            />
          </Stack>
        </Box>

        <Typography sx={{color:"#474E68",fontFamily:"Poppins",fontSize:"14px"}}>Total Applicants: {job?.job?.totalApplications}</Typography>
      </CardContent>
    </Box>
  );

  return <Box>{isMobile || flag ? mobileView : desktopView}</Box>;
};

export default AppliedJobCard;