import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CompanyCard, CustomButton, Header, ListBox, Loading } from "../components";
import { companies } from "../utils/data";
import { apiRequest, updateURL } from "../utils";

const Companies = () => {
  const [page, setPage] = useState(1);
  const [numPage, setNumPage] = useState(1);
  const [recordsCount, setRecordsCount] = useState(0);
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cmpLocation, setCmpLocation] = useState("");
  const [sort, setSort] = useState("Newest");
  const [isFetching, setIsFetching] = useState(false);
  const [errMsg, setErrMsg] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    setIsFetching(true);

    const newURL = updateURL({
      query: searchQuery,
      cmpLoc: cmpLocation,
      sort: sort,
      pageNum: page,
      location: location,
      // navigate: navigate,
    });

    try {
      console.log(sort)
      const res = await apiRequest({
        url:`/companies/get-companies${sort&&`?sort=${sort}`}`,
        method: "GET",
        params: newURL,
      });

      console.log(res);
      setNumPage(res?.numOfPage);
      setRecordsCount(res?.total);
      setData(res?.data);
    } catch (error) {
      console.log(error);
    }

    setIsFetching(false);
  };

  const handleSearchSubmit = async (e) => {

    e.preventDefault();
    setSearchQuery(e.target.value);
    setCmpLocation(e.target.value);

    await fetchCompanies(); 
    
  };

  const handleShowMore = () => {

  };

  useEffect(() => {
    fetchCompanies();
  }, [page,sort]);

  return (
    <div className="w-full bg-white min-h-screen">
      <div className="w-full flex items-center justify-center"><h1 className="text-4xl text-[Poppins] text-[#1176DB] capitalize">Find your Next Opportunity at our world class recruiters</h1></div>

      <div className="container mx-auto flex flex-col gap-5 2xl:gap-10 px-5 md:px-0 py-6 ">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm md:text-base">
          Showing: <span className="font-semibold">{data.length}</span> Companies Available

          </p>

          <div className="flex flex-col md:flex-row gap-0 md:gap-2 md:items-center">
            <p className="text-sm md:text-base">Sort By:</p>

            <ListBox sort={sort} setSort={setSort} />
          </div>
        </div>

        <div className="w-full flex flex-col items-center gap-6  ">
          {data?.map((cmp, index) => (
            <CompanyCard cmp={cmp} key={index} />
          ))}

          {isFetching && (
            <div className="mt-10">
              <Loading />
            </div>
          )}

          <p className="text-sm text-right">
            {data?.length} records out of {data?.length}
          </p>
        </div>

        {numPage > page && !isFetching && (
          <div className="w-full flex items-center justify-center pt-16 ">
            <CustomButton
              onClick={handleShowMore}
              title="Load More"
              containerStyles={`text-blue-600 py-1.5 px-5 focus:outline-none hover:bg-blue-700 hover:text-white rounded-full text-base border border-blue-600`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;



