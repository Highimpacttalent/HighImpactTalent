import { useMediaQuery,useTheme } from "@mui/material";
import MobileView from "./mobile";
import DesktopView from "./desktop";
import {Box} from "@mui/material";
const View = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default View;