import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { HiLocationMarker } from "react-icons/hi";
import { AiOutlineMail } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { CustomButton, TextInput } from "../components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UpdateUser } from "../redux/userSlice";

const UserProfile = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userInfo,setUser] = useState();
  // const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "ml_default");

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dk2d8tq74/image/upload`, 
          formData
        );
        // This is the URL of the uploaded image
        console.log(response.data.secure_url);
        const profile = await axios.post(
          `https://highimpacttalent.onrender.com/api-v1/user/updateprofileurl`,
          { profileUrl: response.data.secure_url },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (profile.data.success) {
          alert("profile url updated");
          dispatch(UpdateUser(profile.data.user));
          setImageUrl(response.data.secure_url);
        }
      } catch (error) {
        console.error("Error uploading the image", error);
      }
    }
  };
  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  useEffect(()=>{
    const fetchUser = async () => {
      try {
        const response = await axios.get("https://highimpacttalent.onrender.com/api-v1/user/get", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`,
          },
          params: {
            id: user?.id
          }
        });
  
        console.log(response?.data?.user);
        setUser(response?.data?.user)
        console.log(userInfo)
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
  
    fetchUser();
  },[user?.token, user?.id])

  return (
    <div className="container mx-auto py-10 px-4 flex items-center justify-center">
  <div className="w-full md:w-2/3 2xl:w-2/4 bg-white shadow-xl rounded-xl p-8 space-y-8">
    {/* Profile Picture and Name Section */}
    <div className="flex flex-col items-center gap-6">
      <div className="w-24 h-24 md:w-36 md:h-36 2xl:w-48 2xl:h-48 rounded-full overflow-hidden border-4 border-blue-500">
        {imageUrl ? (
          <img src={imageUrl} alt="Uploaded" className="w-full h-full object-cover" />
        ) : (
          <img
            src={userInfo?.profileUrl || "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010"}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        )}
      </div>
      <h2 className="text-3xl font-semibold capitalize text-gray-800">{userInfo?.firstName + " " + userInfo?.lastName}</h2>
      <div className="text-sm text-center text-gray-600 space-y-2">
        <p className="flex gap-2 items-center justify-center"><AiOutlineMail /> {userInfo?.email ?? "No Email"}</p>
        <p className="flex gap-2 items-center justify-center"><FiPhoneCall /> {userInfo?.contactNumber ?? "No Contact"}</p>
        <p className="flex gap-2 items-center justify-center"><HiLocationMarker /> {userInfo?.currentLocation ?? "No Location"}</p>
      </div>
    </div>

    {/* Upload Profile Picture */}
    <div className="space-y-4">
      <input type="file" onChange={handleFileChange} className="w-full px-4 py-2 border rounded-lg text-gray-700 bg-gray-50 focus:ring-2 focus:ring-blue-500" />
      <button onClick={handleImageUpload} className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300">Upload Profile Pic</button>
    </div>

    {/* Resume Section */}
    <div className="border-t pt-4 space-y-4">
      <h3 className="text-xl font-semibold capitalize">Resume</h3>
      <div className="h-10 border rounded-lg overflow-hidden">
        {userInfo?.cvUrl ? (
          <a href={userInfo?.cvUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-blue-500 text-white py-2 hover:bg-blue-600 transition duration-300">
            View Resume
          </a>
        ) : (
          <Link to="/upload-resume">
            <button className="w-full flex items-center justify-center bg-blue-500 text-white py-2 hover:bg-blue-600 transition duration-300">
              Upload Resume
            </button>
          </Link>
        )}
      </div>
    </div>

    {/* Profile Details */}
    <div className="border-t pt-4 space-y-4">
      <h3 className="text-xl font-semibold capitalize">Details</h3>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Experience:</span>
          <span className="text-gray-600">{userInfo?.experience ?? "No Experience"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Current Company:</span>
          <span className="text-gray-600">{userInfo?.currentCompany ?? "Not Available"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Current Job:</span>
          <span className="text-gray-600">{userInfo?.currentJobRole ?? "Not Available"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Join Consulting:</span>
          <span className="text-gray-600">{userInfo?.joinConsulting ?? "Not Available"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Open to Relocate:</span>
          <span className="text-gray-600">{userInfo?.openToRelocate ?? "Not Specified"}</span>
        </div>
      </div>
    </div>

    {/* Profile Summary */}
    <div className="border-t pt-4 space-y-4">
      <h3 className="text-xl font-semibold capitalize">Profile Summary</h3>
      <p className="text-sm text-gray-600">{userInfo?.about ?? "No Summary Available"}</p>
    </div>

    {/* Update Details Button */}
    <div className="flex justify-center">
      <button
        className="w-full md:w-64 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
        onClick={() => navigate("/user-additional-details")}
      >
        Update Details
      </button>
    </div>
  </div>
</div>

  );
};

export default UserProfile;
