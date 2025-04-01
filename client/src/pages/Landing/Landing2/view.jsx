import { useMediaQuery,useTheme } from "@mui/material";
import MobileView from "./mobile.jsx";
import DesktopView from "./desktop.jsx";
import {Box} from "@mui/material";
const Landing2 = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default Landing2;