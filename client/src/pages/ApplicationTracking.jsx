import { useMediaQuery,useTheme } from "@mui/material";
import MobileView from "./ApplicationTracking/mobile";
import DesktopView from "./ApplicationTracking/Desktop";
import {Box} from "@mui/material";
const FindJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default FindJobs;