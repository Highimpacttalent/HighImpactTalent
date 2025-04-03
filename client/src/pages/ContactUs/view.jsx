import { useMediaQuery,useTheme } from "@mui/material";
import ContactUsDesktop from "./desktop";
import ContactUsMobile from "./mobile";
import {Box} from "@mui/material";
const ContactUsPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return <Box>{isMobile ? <ContactUsMobile /> : <ContactUsDesktop />}</Box>;
};

export default ContactUsPage;