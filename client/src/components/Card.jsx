import { GoLocation } from "react-icons/go";
import moment from "moment";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { apiRequest } from "../utils";
import axios from "axios";
import JobCard from "./JobCard";

function Card({ jobId, name, location}) {
  const params = useParams();
    console.log(jobId, name, location);
  const [info, setInfo] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const jobDets = async () => {
    setIsLoading(true);
    let id = params.id ? params.id : user?._id;
    try {
      console.log(jobId)
      const res = await axios.get(`https://demojobportal.onrender.com/api-v1/jobs/get-job-detail/${jobId}`)
      console.log('card -',res)
      console.log(res.data.data.jobTitle);
      setInfo(res.data.data);
      
      setIsLoading(false);
    } catch (error) {
      //   console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    jobDets();
  }, []);
  return (
    <>
      <Link to={`/job-detail/${jobId}`}>
        <JobCard job={info}></JobCard>
      </Link>
    </>
  );
}

export default Card;
