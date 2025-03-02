import React, { useState, useEffect } from "react";
import { FaSearch, FaBriefcase, FaUsers } from "react-icons/fa";
import { Dialog, Transition } from "@headlessui/react";
import { Box, Button, Container, Grid, Typography, Paper } from "@mui/material";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import man from "../assets/man.png";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import tlogo from "../assets/transparentlogo.png";
import toptt from "../assets/top-tier-talent.jpg";
import industry from "../assets/industri.jpg";
import personlized from "../assets/personlized.jpg";
import { WorkOutline, GroupAdd } from "@mui/icons-material";
import { motion } from "framer-motion";
import landing from "../assets/landing.svg";

const Landing = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user || Object.keys(user).length === 0) {
      setIsOpen(true);
    }
  }, [user]);

  const LoginModal = (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white p-8 md:p-10 rounded-xl shadow-2xl w-[90%] max-w-lg text-center transform transition-all">
            {/* Header */}
            <Dialog.Title className="text-3xl font-bold text-blue-600 tracking-wide ">
              Find Opportunities. Build Success.
            </Dialog.Title>
            <p className="text-gray-600 mt-3 text-base md:text-lg leading-relaxed">
              Whether you're seeking <bold>top talent</bold> or{" "}
              <bold>exciting career opportunities</bold>, we've got you covered.
            </p>

            {/* Selection Boxes */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hire Talent Box */}
              <div
                onClick={() => navigate("/r-login")}
                className="p-8 bg-gradient-to-b from-blue-50 to-blue-100 border border-blue-300 rounded-xl shadow-lg cursor-pointer transition transform hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center text-center"
              >
                <GroupAdd className="text-blue-700 text-7xl drop-shadow-lg" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  Hire Talent
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Find skilled professionals to power your business.
                </p>
              </div>

              {/* Search Job Box */}
              <div
                onClick={() => navigate("/u-login")}
                className="p-8 bg-gradient-to-b from-green-50 to-green-100 border border-green-300 rounded-xl shadow-lg cursor-pointer transition transform hover:-translate-y-1 hover:shadow-2xl flex flex-col items-center text-center"
              >
                <WorkOutline className="text-green-700 text-7xl drop-shadow-lg" />
                <h3 className="mt-4 text-xl font-semibold text-gray-800">
                  Search Job
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Explore new career paths and exciting opportunities.
                </p>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );

  return (
    <div className="overflow-x-hidden">
      {LoginModal}
      <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 10 },
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "white",
          }}
        >
          <Box sx={{ flex: 1, textAlign: { xs: "center", md: "left" },
            }}>
            <Typography
              variant="h3"
              fontWeight={600}
              gutterBottom
              sx={{
                fontFamily: "Inter, sans-serif",
                fontSize: { xs: "1.8rem", sm: "2.2rem", md: "3rem" }, // Smaller font on mobile
              }}
            >
              A job portal designed for{" "}
              <span
                style={{
                  color: "blue",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "600",
                }}
              >
                Impact
              </span>
              . Find the right fit, hire or get hired today
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                fontFamily: "Poppins",
                fontSize: { xs: "0.875rem", sm: "1rem" }, // Reduce font size for mobile
              }}
            >
              Top talent and high-impact opportunities move fast. Be part of the
              elite network that gets there first.
            </Typography>

            <Box
              sx={{
                mt: 3,
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                justifyContent: { xs: "center", md: "flex-start" },
                height: 50,
              }}
            >
              <Button
                variant="contained"
                component={Link}
                to="/u-login"
                sx={{
                  bgcolor: "#3C7EFC",
                  borderRadius: 8,
                  fontFamily: "Poppins",
                }}
              >
                Find Your Opportunity
              </Button>
              <Button
                variant="contained"
                component={Link}
                to="/r-login"
                sx={{
                  bgcolor: "#3C7EFC",
                  borderRadius: 8,
                  fontFamily: "Poppins",
                }}
              >
                Hire Top Talents
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              mt: { xs: 4, md: 0 },
            }}
          >
            <img
              src={landing}
              alt="Professional"
              style={{ width: "100%", maxWidth: "400px", borderRadius: "8px" }}
            />
          </Box>
        </Box>

        <Box sx={{ py: 5, bgcolor: "white" }}>
          <Container>
            {[
              {
                img: toptt,
                title: "Top-Tier Talent",
                desc: "Access a curated pool of professionals with expertise in digital transformation, sustainability, data-driven decision-making, and more.",
              },
              {
                img: industry,
                title: "Industry Insights",
                desc: "Stay ahead with the latest hiring trends and strategies for 2024 and beyond.",
              },
              {
                img: personlized,
                title: "Personalized Matching",
                desc: "Our advanced algorithms and expert team ensure the best fit for both candidates and employers.",
              },
            ].map((item, index) => (
              <motion.div
            key={index}
            initial={{ opacity: 0, x: index % 2 === 0 ? -100 : 100 }} // Left for even index, Right for odd
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }} // Trigger only once when 30% is in view
          >
            <Paper
              sx={{
                p: 3,
                my: 2,
                display: "flex",
                alignItems: "center",
                gap: 3,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <img
                src={item.img}
                alt={item.title}
                style={{
                  width: "100%",
                  maxWidth: "200px",
                  borderRadius: "8px",
                }}
              />
              <Box>
                <Typography
                  variant="h6"
                  color="primary"
                  fontWeight={600}
                  sx={{ fontFamily: "Poppins" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "Poppins" }}>
                  {item.desc}
                </Typography>
              </Box>
            </Paper>
          </motion.div>
        ))}
          </Container>
        </Box>
      </Box>
    </div>
  );
};

export default Landing;
