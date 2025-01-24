import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { BsPersonFillCheck } from "react-icons/bs";
import { IoIosHeartEmpty, IoMdHeart } from "react-icons/io";
import { UpdateUser } from "../redux/userSlice";

const JobCard = ({ job }) => {
  const dispatch = useDispatch(); // Get the dispatch function
  const { user } = useSelector((state) => state.user);
  const [like, setLike] = useState(false);

  // Set the initial like state based on user.likedJobs
  useEffect(() => {
    if (user?.likedJobs?.includes(job._id)) {
      setLike(true);
    } else {
      setLike(false);
    }
  }, [user, job._id]);

  const handleLikeClick = (e, jobId) => {
    e.stopPropagation();
    toggleLike(jobId);
  };

  const toggleLike = async (jobId) => {
    try {
      const response = await axios.post(
        "https://demojobportal.onrender.com/api-v1/user/togglelike",
        { jobId },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      // console.log(response)
      if (response.data.success) {
        const updatedUser = response.data.user;
        // Update the like state based on the response
        setLike(!like);

        // Update the Redux state with the new user data
        dispatch(UpdateUser(updatedUser));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <div>
      <div className="w-full h-full shadow-sm bg-white flex flex-col justify-between rounded-md p-3 transition-transform transform hover:scale-105 hover:shadow-xl overflow-hidden">
        <div className="flex justify-between">
          <Link
            to={`/job-detail/${job?._id}`}
            className="flex gap-2 items-center mb-1"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzs8x_9_bjHF_paKJr8R5lgMWuoN8_aqs0upHo8xmlXgjhKmOX39-Jj4gxXTy_KminlFc&usqp=CAU"
              alt={job?.company?.name}
              className="w-5 h-5 object-cover"
            />
            <span className="text-sm text-gray-600 uppercase">
              {job?.company?.name}
            </span>
          </Link>
          <div onClick={(e) => handleLikeClick(e, job._id)}>
            {!like ? <IoIosHeartEmpty /> : <IoMdHeart />}
          </div>
        </div>
        <Link to={`/job-detail/${job?._id}`}>
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold text-zinc-700 w-full text-wrap">
              {job?.jobTitle}
            </p>
          </div>
          <div className="mb-1">
            <p className="text-xs text-gray-600 line-clamp-2">
              {job?.jobDescription}
            </p>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            <span className="flex text-xs gap-2 items-center text-gray-600">
              <MdLocationOn className="text-blue-500 font-semibold" />
              {job?.jobLocation}
            </span>
          </div>
          <div className="flex flex-col gap-1 mb-3">
            <span className="text-xs text-gray-600 flex gap-2 ">
              <BsPersonFillCheck className="text-blue-500 font-semibold" />
              {job?.experience} year+
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-500 text-xs">
              {moment(job?.createdAt).fromNow()}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
