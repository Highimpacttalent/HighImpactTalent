    import { useEffect, useState } from "react";
    import { useSelector, useDispatch } from "react-redux";
    import axios from "axios";
    import moment from "moment";
    import { Link } from "react-router-dom";
    import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Button,
    IconButton,
    Divider,
    Chip,
    Box,
    Stack,
    Paper,
    useMediaQuery,
    useTheme,
    } from "@mui/material";
    import { useNavigate } from "react-router-dom";
    import {
    LocationOnOutlined,
    LocationOn,
    Work,
    WorkOutlineOutlined,
    Business,
    Bookmark,
    BookmarkBorder,
    CurrencyRupee,
    HomeWork,
    } from "@mui/icons-material";

    const TopJobCard = ({job}) => {
        const { user } = useSelector((state) => state.user);
        const [like, setLike] = useState(false);
        const navigate = useNavigate();
        
        
        
            const handleLikeClick = async (e, jobId) => {
                e.stopPropagation();
                try {
                const response = await axios.post(
                    "https://highimpacttalent.onrender.com/api-v1/user/togglelike",
                    { jobId },
                    {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                        "Content-Type": "application/json",
                    },
                    }
                );
                if (response.data.success) {
                    setLike(!like);
                    dispatch(UpdateUser(response.data.user));
                }
                } catch (error) {
                console.error("Error toggling like:", error);
                }
            };
        
        useEffect(() => {
            setLike(user?.likedJobs?.includes(job._id));
        }, [user, job._id]);
        const mobileView = (
            <Card sx={{ 
            maxWidth: 400, 
            display: "flex", 
            flexDirection: "column", 
            height: "100%", 
            boxShadow: "0px 0px 4px 0px #00000040", 
            borderRadius: 2, 
            }}
            onClick={()=>navigate(`/job-detail/${job?._id}`)}
            >
            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                {/* Job Title */}
                <Typography 
  variant="h6" 
  fontWeight={700} 
  sx={{ 
    color: "#404258", 
    mb: 1.5, 
    fontFamily: "Poppins",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }}
>
  {job?.jobTitle}
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
                    label={job?.jobLocation}
                    variant="contained" 
                    sx={{color:"#474E68",fontWeight:"400"}}
                    />
                    <Chip
                    icon={<WorkOutlineOutlined sx={{color:"#474E68"}}/>}
                    label={`${job?.experience}+ years experience`}
                    variant="contained"
                    sx={{color:"#474E68",fontWeight:"400"}}
                    />
                    </Box>
                    <Chip
                    icon={<CurrencyRupee sx={{color:"#474E68"}}/>}
                    label={
                        job.salaryConfidential
                        ? "Confidential"
                        : `${job.salary} (${job.salaryCategory})`
                    }
                    variant="contained"
                    sx={{color:"#474E68",fontWeight:"400"}}
                    />
                </Box>
            </CardContent>
        
            {/* Fixed Bottom Section */}
            <CardActions sx={{ display: "flex", justifyContent: "space-between", pl: 2,pr:2}}>
                <Typography variant="caption" color="text.secondary">
                Posted {moment(job?.createdAt).fromNow()}
                </Typography>
                <IconButton onClick={(e) => handleLikeClick(e, job._id)}>
                    {like ? <Bookmark color="primary" /> : <BookmarkBorder color="action" />}
                <Typography gap={1}>Save</Typography>
                </IconButton>
            </CardActions>
            </Card>
        );
        return mobileView;
    }

    export default TopJobCard;
