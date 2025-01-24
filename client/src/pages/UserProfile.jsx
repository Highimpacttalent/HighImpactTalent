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
  // const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const userInfo = user;
  console.log(user);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async () => {
    if (image) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", "jtzzkmlf"); // Use the ml_default preset

      try {
        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/db7pikwo4/image/upload`, // Replace 'your_cloud_name' with your actual cloud_name
          formData
        );
        // This is the URL of the uploaded image
        console.log(response.data.secure_url);
        const profile = await axios.post(
          `https://demojobportal.onrender.com/api-v1/user/updateprofileurl`,
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
  return (
    <div className="container mx-auto flex items-center justify-center py-10 ">
      <div className="w-full md:w-2/3 2xl:w-2/4 bg-white flex flex-col gap-3 shadow-lg p-10 rounded-lg">
        <div className="flex gap-3 flex-col">
          <div className="w-20 h-20  2xl:w-36 2xl:h-36 md:w-24 md:h-24 rounded-full border border-blue-500 flex items-center justify-center overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" />
            ) : (
              <div>
                {user?.profileUrl ? (
                  <img src={user?.profileUrl} alt="" />
                ) : (
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010"
                    alt=""
                  />
                )}
              </div>
            )}
          </div>

          <div className="">
            <h2 className="text-4xl capitalize">
              {" "}
              {userInfo?.firstName + " " + userInfo?.lastName}
            </h2>
            <div className="flex flex-col text-sm">
              <p className="flex gap-1 items-center py-1 text-slate-600 rounded-full">
                <AiOutlineMail /> {userInfo?.email ?? "No Email"}
              </p>
              <p className="flex gap-1 items-center py-1 text-slate-600 rounded-full">
                <FiPhoneCall /> {userInfo?.contactNumber ?? "No Contact"}
              </p>
              <p className="flex gap-1 items-center py-1 text-slate-600 rounded-full">
                <HiLocationMarker />{" "}
                {userInfo?.currentLocation ?? "No Location"}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <input type="file" onChange={handleFileChange} />
          <div
            onClick={handleImageUpload}
            className="bg-blue-500 p-2 text-white"
          >
            Upload Profile Pic
          </div>
        </div>
        <div className="capitalize border rounded p-2">
          <div>resume</div>
          <div className="border rounded h-10 overflow-hidden">
            {user?.cvUrl != "" ? (
              <a href={userInfo?.cvUrl}>
                <div className="bg-blue-500 p-2 text-white">view Resume</div>
              </a>
            ) : (
              <Link to={"/upload-resume"}>
                <div className="bg-blue-500 p-2 text-white">Upload Resume</div>
              </Link>
            )}
          </div>
        </div>
        <div className="capitalize border rounded p-2">
          <div>Details</div>
          <div className="pl-2">
            <div className="flex text-sm gap-2">
              <p className="">experience :</p>
              <p className="text-slate-600">
                {userInfo?.experience ?? "experience"}
              </p>
            </div>
            <div className="flex text-sm gap-2">
              <p>Current Company :</p>
              <p className="text-slate-600">
                {userInfo?.currentCompany ?? "current company"}
              </p>
            </div>
            <div className="flex text-sm gap-2">
              <p>Current Job :</p>
              <p className="text-slate-600">
                {userInfo?.currentJobRole ?? "currentJobRole"}
              </p>
            </div>
            <div className="flex text-sm gap-2">
              <p>join Consulting :</p>
              <p className="text-slate-600">
                {userInfo?.joinConsulting ?? "joinConsulting"}
              </p>
            </div>
            <div className="flex text-sm gap-2">
              <p>open To Relocate :</p>
              <p className="text-slate-600">
                {userInfo?.openToRelocate ?? "openToRelocate"}
              </p>
            </div>
          </div>
        </div>
        <div className="border rounded p-2">
          <div>Profile summary</div>
          <p className="text-slate-600 pl-3 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat
            facere eveniet nam ut officia iste magni repudiandae cupiditate
            harum assumenda.
          </p>
          {/* {userInfo?.about ?? "No About Found"} */}
        </div>
        <div className="border rounded p-2 ">
          <button
            className="w-full md:w-64 bg-blue-500 text-white py-2 capitalize rounded"
            onClick={() => {
              navigate("/user-additional-details");
            }}
          >
            update details
          </button>
        </div>
      </div>

      {/* <UserForm open={open} setOpen={setOpen} /> */}
    </div>
  );
};

export default UserProfile;
