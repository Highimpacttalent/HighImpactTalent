import mongoose from "mongoose";
import Companies from "../models/companiesModel.js";
import { response } from "express";
import bcrypt from "bcryptjs";
// company register
export const register = async (req, res, next) => {
  const {  companyName, email, copmanyType, password } =
    req.body;
  //validate fields
  if (!companyName) {
    next("Company Name is required!");
    return;
  }
  if (!email) {
    next("Email address is required!");
    return;
  }
  if (!password) {
    next("Password is required and must be greater than 6 characters");
    return;
  }
  const name = companyName;
  try {
    const accountExist = await Companies.findOne({ email });

    if (accountExist) {
      next("Email Already Registered. Please Login");
      return;
    }
    // create a new account
    const company = await Companies.create({
      name,
      email,
      password,
      copmanyType,
    });

    // user token
    const token = company.createJWT();

    res.status(201).json({
      success: true,
      message: "Company Account Created Successfully",
      user: {
        _id: company._id,
        name: company.name,
        email: company.email,
        companyType: company.copmanyType,
        accountType: company.accountType,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// company login
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide AUser Credentials");
      return;
    }

    const company = await Companies.findOne({ email });
    if (!company) {
      next("Invalid email or Password=");
      return;
    }
    // console.log(company)
    // const match = await bcrypt.compare(password, company.password)
    // if(!match){
    //   return res.status(404).json({
    //     success:false,
    //     message:"password not match"
    //   })
    // }
    
    // const match = await bcrypt.compare("Qwert123$", company.password)
    // console.log('inside controller -',password,"Qwert123$", company.password,match)
    // compare password
    const isMatch = await company.comparePassword(password);
    // console.log(isMatch)
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "password not match",
      });
    }
    company.password = undefined;

    const token = company.createJWT();

    res.status(200).json({
      success: true,
      message: "Login SUccessfully",
      user: company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// update company details
export const updateCompanyProfile = async (req, res, next) => {
  const { name, contact, location, profileUrl, about } = req.body;

  try {
    const id = req.body.user.userId;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send(`No Company with id: ${id}`);

    const updateCompany = {
      name,
      contact,
      location,
      profileUrl,
      about,
      _id: id,
    };

    const company = await Companies.findByIdAndUpdate(id, updateCompany, {
      new: true,
    });

    const token = company.createJWT();

    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company Profile Updated SUccessfully",
      company,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// get company details
export const getCompanyProfile = async (req, res, next) => {
  try {
    const id = req.body.user.userId;

    const company = await Companies.findById({ _id: id });

    if (!company) {
      return res.status(200).send({
        message: "Company Not Found",
        success: false,
      });
    }

    company.password = undefined;
    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET ALL COMPANIES and can filter with query parameters
export const getCompanies = async (req, res, next) => {
  try {
    const { search, sort, location } = req.query;

    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.name = { $regex: search, $options: "i" };
    }

    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    let queryResult = Companies.find(queryObject).select("-password");

    // SORTING
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
    }

    // PADINATIONS
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    // records count
    const total = await Companies.countDocuments(queryResult);
    const numOfPage = Math.ceil(total / limit);
    // move next page
    // queryResult = queryResult.skip(skip).limit(limit);

    // show mopre instead of moving to next page
    queryResult = queryResult.limit(limit * page);

    const companies = await queryResult;

    res.status(200).json({
      success: true,
      total,
      data: companies,
      page,
      numOfPage,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

//GET  COMPANY JOBS
export const getCompanyJobListing = async (req, res, next) => {
  const { search, sort } = req.query;
  const id = req.body.user.userId;

  try {
    //conditons for searching filters
    const queryObject = {};

    if (search) {
      queryObject.location = { $regex: search, $options: "i" };
    }

    let sorting;
    //sorting || another way
    if (sort === "Newest") {
      queryResult = queryResult.sort("-createdAt");
      // sorting = "-createdAt";
    }
    if (sort === "Oldest") {
      queryResult = queryResult.sort("createdAt");
      // sorting = "createdAt";
    }
    if (sort === "A-Z") {
      queryResult = queryResult.sort("name");
      // sorting = "name";
    }
    if (sort === "Z-A") {
      queryResult = queryResult.sort("-name");
      // sorting = "-name";
    }

    let queryResult = await Companies.findById({ _id: id }).populate({
      path: "jobPosts",
      options: { sort: sorting },
    });
    const companies = await queryResult;

    res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

// GET SINGLE COMPANY
export const getCompanyById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    console.log("Received request for company ID:", id);

    // Fetch the company data from the database
    const company = await Companies.findById(id);

    // Check if the company exists
    if (!company) {
      return res.status(404).json({
        message: "Company Not Found",
        success: false,
      });
    }

    console.log("Company found:", company);

    // Remove the password field from the response
    company.password = undefined;

    res.status(200).json({
      success: true,
      data: company,
    });
  } catch (error) {
    console.error("Error in getCompanyById:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
