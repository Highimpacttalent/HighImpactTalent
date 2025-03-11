import { useMediaQuery,useTheme } from "@mui/material";
import DesktopView from "./JobDetails/desktop";
import MobileView from "./JobDetails/mobile";
import {Box} from "@mui/material";
const JobDetail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default JobDetail;