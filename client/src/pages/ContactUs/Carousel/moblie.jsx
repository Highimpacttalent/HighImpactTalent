import React, { useRef } from "react";
import { Box, IconButton } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const CustomCarousel = ({ items }) => {
  const carouselRef = useRef(null);

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  return (
    <Box sx={{ position: "relative", width: "100%", textAlign: "center" }}>

      {/* Scrollable Container (Without Scrollbar) */}
      <Box
        ref={carouselRef}
        sx={{
          display: "flex",
          overflowX: "scroll",
          scrollBehavior: "smooth",
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          "&::-webkit-scrollbar": { display: "none" }, // Hide scrollbar for Chrome/Safari
        }}
      >
        {items.map((item, index) => (
          <Box
            key={index}
            sx={{
              flex: "0 0 auto",
              width: "100%",
              borderRadius: 4,
              mx: 2, // Space between slides
            }}
          >
            {item}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default CustomCarousel;
