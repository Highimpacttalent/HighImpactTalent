import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TextInput from "./TextInput";
import { apiRequest } from "../utils";
import CustomButton from "./CustomButton";
import JobTypes from "./JobTypes";
import { Login } from "../redux/userSlice";

const SignUp = ({ open, setOpen }) => {
  const [currentJobRole, setCurrentJobRole] = useState("Accenture strategy");
  const [otherJob, setOtherJob] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const dispatch = useDispatch();
  const location = useLocation();
  const [loading, setloadting] = useState(false);
  const [isRegister, setIsRegister] = useState(true);
  const [accountType, setAccountType] = useState("seeker");
  const navigate = useNavigate()
  const [errMsg, setErrMsg] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  });
  // let from = location.state?.from?.pathname || "/";

  const closeModal = () => setOpen(false);

  const onSubmit = async (formData) => {
    console.log(currentJobRole)
    const newData = { ...formData, currentJobRole: currentJobRole,copmanyType:selectedOption };
    let URL = null;
    if (isRegister) {
      if (accountType === "seeker") {
        URL = "user/register";
      } else {
        URL = "companies/register";
      }
    } else {
      if (accountType === "seeker") {
        URL = "user/login";
      } else {
        URL = "companies/login";
      }
    }
    try {
      console.log(formData,newData)
      setloadting(true);
      const res = await apiRequest({
        url: URL,
        method: "POST",
        data: newData,
      });
      console.log(res);
      if (res?.status === "failed") {
        setErrMsg(res?.message);
      } else {
        setErrMsg("");
        const userData = { token: res?.token, ...res?.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        if(isRegister){
          navigate('/user-additional-details')
        }else if(accountType=='seeker'){
          navigate('/find-jobs')
        }
        setloadting(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-red-500 h-screen w-screen">
      <Transition appear show={open || false}>
        <Dialog as="div" className="relative z-[1001]" onClose={() => {}}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-semibold lwading-6 text-gray-900"
                  >
                    {isRegister ? "Create Account" : "Account Sign In"}
                  </Dialog.Title>

                  <div className="w-full flex gap-2 items-center justify-center py-4 ">
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${
                        accountType === "seeker"
                          ? "bg-[#1176DB] text-white font-semibold"
                          : "bg-white border border-[#1176DB]"
                      }`}
                      onClick={() => setAccountType("seeker")}
                    >
                      User Account
                    </button>
                    <button
                      className={`flex-1 px-4 py-2 rounded text-sm outline-none ${
                        accountType !== "seeker"
                          ? "bg-[#1176DB] text-white font-semibold"
                          : "bg-white border border-[#1176DB]"
                      }`}
                      onClick={() => setAccountType("company")}
                    >
                      Company Account
                    </button>
                  </div>

                  <form
                    className="w-full flex flex-col gap-5"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <TextInput
                      name="email"
                      label="Email Address"
                      placeholder="email@example.com"
                      type="email"
                      register={register("email", {
                        required: "Email Address is required!",
                      })}
                      error={errors.email ? errors.email.message : ""}
                    />

                    {isRegister && (
                      <div className="w-full flex gap-1 md:gap-2">
                        <div
                          className={`${
                            accountType === "seeker" ? "w-1/2" : "w-full"
                          }`}
                        >
                          <TextInput
                            name={
                              accountType === "seeker" ? "firstName" : "name"
                            }
                            label={
                              accountType === "seeker"
                                ? "First Name"
                                : "Company Name"
                            }
                            placeholder={
                              accountType === "seeker"
                                ? "eg. James"
                                : "Comapy name"
                            }
                            type="text"
                            register={register(
                              accountType === "seeker" ? "firstName" : "name",
                              {
                                required:
                                  accountType === "seeker"
                                    ? "First Name is required"
                                    : "Company Name is required",
                              }
                            )}
                            error={
                              accountType === "seeker"
                                ? errors.firstName
                                  ? errors.firstName?.message
                                  : ""
                                : errors.name
                                ? errors.name?.message
                                : ""
                            }
                          />
                        </div>
                        
                        {accountType === "seeker" && isRegister && (
                          <div className="w-1/2">
                            <TextInput
                              name="lastName"
                              label="Last Name"
                              placeholder="Wagonner"
                              type="text"
                              register={register("lastName", {
                                required: "Last Name is required",
                              })}
                              error={
                                errors.lastName ? errors.lastName?.message : ""
                              }
                            />
                          </div>
                        )}
                      </div>
                    )}
                    {accountType != "seeker" && isRegister && (
                          <div className="w-full">
                            <h2 className="text-sm">
                              Select an Option
                            </h2>
                            <div className="flex gap-4">
                              <div className="flex items-center ">
                                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                                  <input
                                    type="checkbox"
                                    value="hiringAgency"
                                    checked={selectedOption === "hiringAgency"}
                                    onChange={(e) => {
                                      setSelectedOption(e.target.value);
                                  }}
                                    className="mr-2 leading-tight"
                                  />
                                  Hiring Agency
                                </label>
                              </div>
                              <div className="">
                                <label className="block text-gray-700 text-sm font-bold mb-2 flex items-center">
                                  <input
                                    type="checkbox"
                                    value="company"
                                    checked={selectedOption === "company"}
                                    onChange={(e) => {
                                      setSelectedOption(e.target.value);
                                  }}
                                    className="mr-2 leading-tight"
                                  />
                                  Company
                                </label>
                              </div>
                            </div>
                          </div>
                        )}
                    {isRegister && accountType == "seeker" && (
                      <div className={`w-full mt-2`}>
                        <label className="text-gray-600 text-sm mb-1">
                          Current Job
                        </label>
                        <JobTypes
                          currentJobRole={currentJobRole}
                          setCurrentJobRole={setCurrentJobRole}
                        />
                        {currentJobRole == "others" && (
                          <div className="flex flex-col h-full items-center">
                            <input
                              onChange={(e) => {
                                setOtherJob(e.target.value);
                              }}
                              type="text"
                              value={otherJob}
                              placeholder="Please Specify..."
                              className="w-full mt-2 rounded border border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base px-4 py-2"
                            />
                            <div
                              onClick={() => {
                                setCurrentJobRole(otherJob);
                              }}
                              className="flex items-center justify-center w-full rounded mt-2 text-white p-2 bg-blue-500 h-full"
                            >
                              Add
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div
                      className={`w-full flex ${
                        isRegister && "flex-col"
                      }  gap-1 md:gap-2`}
                    >
                      <div className="w-full">
                        <TextInput
                          name="password"
                          label="Password"
                          placeholder="Password"
                          type="password"
                          register={register("password", {
                            required: "Password is required!",
                            minLength: {
                              value: 8,
                              message:
                                "Password must be at least 8 characters long",
                            },
                            pattern: {
                              value:
                                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              message: `Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character`,
                            },
                          })}
                          error={
                            errors.password ? errors.password?.message : ""
                          }
                        />
                      </div>

                      {isRegister && (
                        <div className="w-full">
                          <TextInput
                            label="Confirm Password"
                            placeholder="Password"
                            type="password"
                            register={register("cPassword", {
                              validate: (value) => {
                                const { password } = getValues();

                                if (password != value) {
                                  return "Passwords do no match";
                                }
                              },
                            })}
                            error={
                              errors.cPassword &&
                              errors.cPassword.type === "validate"
                                ? errors.cPassword?.message
                                : ""
                            }
                          />
                        </div>
                      )}
                    </div>

                    {errMsg && (
                      <span
                        role="alert"
                        className="text-sm text-red-500 mt-0.5"
                      >
                        {errMsg}
                      </span>
                    )}

                    <div className="mt-2">
                      {/* <CustomButton
                        type="submit"
                        containerStyles={`inline-flex justify-center rounded-md bg-[#14a800] px-8 py-2 text-sm font-medium text-white outline-none hover:bg-[#10a900]`}
                        title={isRegister ? "Create Account" : "Login Account"}
                      /> */}
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-5 rounded-lg w-full"
                      >
                        {isRegister ? (
                          <div>
                            {loading
                              ? "Creating Account...."
                              : "Create Account"}
                          </div>
                        ) : (
                          <div>{loading ? "Login...." : "Login Account"}</div>
                        )}
                      </button>
                    </div>
                  </form>

                  <div className="mt-4">
                    <p className="text-sm text-gray-700">
                      {isRegister
                        ? "Already has an account?"
                        : "Do not have an account"}

                      <span
                        className="text-sm text-[#1176DB] ml-2 hover:scale-125 hover:font-semibold cursor-pointer"
                        onClick={() => setIsRegister((prev) => !prev)}
                      >
                        {isRegister ? "Login" : "Create Account"}
                      </span>
                    </p>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default SignUp;
