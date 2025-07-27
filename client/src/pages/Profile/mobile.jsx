import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeUpload from "./mobile-comp/ResumeCard";
import { UpdateUser } from "../../redux/userSlice";
import SkillCard from "./mobile-comp/SkillCard";
import UserInfocard from "./mobile-comp/ProfileCard";
import Socials from "./mobile-comp/Social";
import ExperienceHistory from "./mobile-comp/WorkEx";
import Experience from "./mobile-comp/Experience";
import AboutSection from "./mobile-comp/About";
import EducationHistory from "./mobile-comp/Education";
import PreferencesCard from "./mobile-comp/PreferencesCard";

const ProfileSection = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userInfo, setUser] = useState();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://highimpacttalent.onrender.com/api-v1/user/get", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
          params: { id: user?.id },
        });
        setUser(response?.data?.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, [user?.token, user?.id]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: { xs: 0, sm: 0, md: 4, lg: 4 }, backgroundColor: "white" }}>
      <Box className="w-full rounded-xl p-8 space-y-8">
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center", justifyContent: "center", gap: 3 }}>
          <UserInfocard userInfo={userInfo} />
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "space-evenly", px: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <ResumeUpload userInfo={userInfo} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <SkillCard userInfo={userInfo} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "space-evenly", px: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <Experience experienceData={userInfo} />
          </Box>
          <Box sx={{ width: { xs: "100%", md: "40%" } }}>
            <Socials userInfo={userInfo} />
            <Box sx={{ mt: 3 }}>
              <PreferencesCard userInfo={userInfo} />
            </Box>
          </Box>
        </Box>

        {/* About Section */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "center", px: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "90%" } }}>
            <AboutSection userInfo={userInfo} />
          </Box>
        </Box>

        {/* Experience History */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "center", px: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "90%" } }}>
            <ExperienceHistory userId={userInfo?._id} experienceHistory={userInfo?.experienceHistory} />
          </Box>
        </Box>
       
       {/* Education History */}
        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, justifyContent: "center", px: 2 }}>
          <Box sx={{ width: { xs: "100%", md: "90%" } }}>
            <EducationHistory userId={userInfo?._id} educationDetails={userInfo?.educationDetails} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfileSection;