import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import ResumeUpload from "./components/ResumeCard";
import { UpdateUser } from "../../redux/userSlice";
import SkillCard from "./components/SkillCard";
import UserInfocard from "./components/ProfileCard";
import Socials from "./components/Social";
import ExperienceHistory from "./components/WorkEx";
import Experience from "./components/Experience";
import AboutSection from "./components/About";
import PreferencesCard from "./components/PreferencesCard";

const ProfileSection = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userInfo, setUser] = useState();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  // const handleImageUpload = async () => {
  //   if (image) {
  //     const formData = new FormData();
  //     formData.append("file", image);
  //     formData.append("upload_preset", "ml_default");

  //     try {
  //       const response = await axios.post(
  //         `https://api.cloudinary.com/v1_1/dk2d8tq74/image/upload`, 
  //         formData
  //       );
  //       console.log(response.data.secure_url);
  //       const profile = await axios.post(
  //         `https://highimpacttalent.onrender.com/api-v1/user/updateprofileurl`,
  //         { profileUrl: response.data.secure_url },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user?.token}`,
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (profile.data.success) {
  //         alert("Profile URL updated");
  //         dispatch(UpdateUser(profile.data.user));
  //         setImageUrl(response.data.secure_url);
  //       }
  //     } catch (error) {
  //       console.error("Error uploading the image", error);
  //     }
  //   }
  // };

  // const handleFileChange = (e) => {
  //   setImage(e.target.files[0]);
  // };

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
      </Box>
    </Box>
  );
};

export default ProfileSection;