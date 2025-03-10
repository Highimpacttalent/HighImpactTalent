import { useMediaQuery,useTheme } from "@mui/material";
import MobileView from "./FindJob/mobile";
import DesktopView from "./FindJob/desktop";
import {Box} from "@mui/material";
const FindJobs = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default FindJobs;