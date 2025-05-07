import { useMediaQuery,useTheme } from "@mui/material";
import MobileView from "./mobile-version/view";
import DesktopView from "./view";
import {Box} from "@mui/material";
const UserAdditionalDetails = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <MobileView /> : <DesktopView />}</Box>;
};

export default UserAdditionalDetails;