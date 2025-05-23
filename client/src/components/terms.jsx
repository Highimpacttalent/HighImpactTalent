import React from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Link,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  margin: theme.spacing(2, 0),
  backgroundColor: "white",
  border: "1px solid #e0e0e0",
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 500,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(1),
  color: "#000000",
  fontFamily: "Poppins",
  fontSize: "16px",
}));

const SubList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(1.5),
  "& .MuiListItem-root": {
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(0),
  },
}));

const Subcontent = {
  fontSize: "13px",
  color: "#000000B2",
  fontFamily: "Poppins",
  paddingLeft: "13px",
};

const TermsOfUsePage = () => {
  return (
    <Box sx={{bgcolor:"white"}}>
    <Container maxWidth="md" sx={{ py: 4 }}>
      <StyledPaper elevation={2}>
        <Box display={"flex"} justifyContent={"center"} mb={4}>
          <Box sx={{ borderBottom: "1px solid #00000080", px: 1 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: "#000000E5",
                fontFamily: "Poppins",
              }}
            >
              Terms of Use
            </Typography>
          </Box>
        </Box>

        <Typography sx={{ fontFamily: "Poppins", fontSize: "14px" }}>
          Welcome to{" "}
          <Link
            href="https://www.highimpacttalent.com"
            target="_blank"
            rel="noopener"
            color="#6EADFF"
            sx={{ textDecoration: "none" }}
          >
            www.highimpacttalent.com
          </Link>
          . These Terms of Use govern your access to and use of our site,
          whether as a guest or a registered user. By accessing, browsing, or
          registering on our site, you agree to comply with these Terms. Please
          read them carefully before using our services.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          1. Acceptance of Terms
        </SectionTitle>
        <Typography style={Subcontent}>
          By using our site, you acknowledge that you have read, understood, and
          agree to be bound by these Terms of Use and any documents referred to
          herein. If you do not agree, please refrain from using the site.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          2. Additional Applicable Terms
        </SectionTitle>
        <Typography style={Subcontent}>
          These Terms incorporate the following documents:
        </Typography>
        <SubList>
          <ListItem >
            <ListItemText secondary="Our Privacy Policy, which details how we collect, use, and safeguard your personal data." />
          </ListItem>
          <ListItem>
            <ListItemText secondary="If you are an employer purchasing services from us, our Commercial Terms also apply." />
          </ListItem>
        </SubList>

        <SectionTitle variant="h5" component="h2">
          3. Modification to Terms
        </SectionTitle>
        <Typography style={Subcontent}>
          We may update these Terms at any time by amending this page. Please
          review it periodically, as your continued use of the site indicates
          your acceptance of any changes.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          4. Updates to Our Site
        </SectionTitle>
        <Typography style={Subcontent}>
          We may update or revise content on our site at any time without
          obligation to do so. We do not guarantee that the content will always
          be accurate or current.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          5. Site Access
        </SectionTitle>
        <Typography style={Subcontent}>
          Access to our site is provided on a temporary basis. We reserve the
          right to suspend, withdraw, or amend services without notice. We are
          not liable for any disruption or unavailability.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          6. Account Responsibility
        </SectionTitle>
        <Typography style={Subcontent}>
          When registering, you must keep your username and password
          confidential. We reserve the right to disable access if we suspect any
          breach of these Terms. If you suspect unauthorized use, notify us
          immediately.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          7. Intellectual Property Rights
        </SectionTitle>
        <Typography style={Subcontent}>
          All content, trademarks, and intellectual property on this site are
          owned or licensed by High Impact Talent. You may not reproduce,
          distribute, or create derivative works without prior written
          permission.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          8. Information Disclaimer
        </SectionTitle>
        <Typography style={Subcontent}>
          The content is for informational purposes only and does not constitute
          professional advice. We make no representations regarding the accuracy
          or completeness of information on the site.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          9. Limitation of Liability
        </SectionTitle>
        <Typography style={Subcontent}>
          We disclaim all liability for any loss or damage arising from your use
          of the site, including viruses, data loss, or reliance on any content.
          Our liability is limited to the fullest extent permitted by Indian
          law.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          10. User-Generated Content
        </SectionTitle>
        <Typography style={Subcontent} h>
          You must ensure any content you upload complies with applicable laws
          and is not defamatory, discriminatory, or infringing. By uploading
          content, you grant us a license to use and share it. We reserve the
          right to remove any content that breaches these standards.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          11. Security and Misuse
        </SectionTitle>
        <Typography style={Subcontent}>
          You are responsible for your IT setup and must use appropriate
          security software. You must not introduce malicious software or
          attempt to gain unauthorized access to the site.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          12. Termination
        </SectionTitle>
        <Typography style={Subcontent}>
          We reserve the right to suspend or terminate your access to our site
          at our discretion, without prior notice, particularly in case of any
          suspected breach of these Terms or unlawful activity.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          13. Linking to Our Site
        </SectionTitle>
        <Typography style={Subcontent}>
          You may link to our homepage in a lawful manner that does not damage
          our reputation. Framing the site or linking in a way that implies
          endorsement is prohibited without written consent.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          14. Third-Party Links
        </SectionTitle>
        <Typography style={Subcontent}>
          Our site may include links to third-party websites. We are not
          responsible for the content or practices of these external sites.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          15. Trademarks
        </SectionTitle>
        <Typography style={Subcontent}>
          All trademarks, logos, and branding on this site are the property of
          High Impact Talent or its licensors and are protected under
          intellectual property laws.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          16. Data Protection Compliance
        </SectionTitle>
        <Typography style={Subcontent}>
          Employers and service providers using our platform are expected to
          comply with applicable data protection laws, including the Digital
          Personal Data Protection Act, 2023. We are not liable for
          non-compliance by third parties.
        </Typography>

        <SectionTitle variant="h5" component="h2">
          17. Contact Us
        </SectionTitle>
        <Typography style={Subcontent}>
          For any queries regarding these Terms, please contact us at 
            highimpacttalentenquiry@gmail.com
          .
        </Typography>

        <Box mt={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                position: "relative",
                color: "#000000",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "18px",
                borderBottom: 0,
                px: 2,
                py:1,

                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  height: "2px",
                  background: "linear-gradient(to right, blue 50%, red 50%)",
                },
              }}
            >
              Thank you for using High Impact Talent.
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{
                color: "#00000080",
                fontFamily: "Poppins",
                fontWeight: 600,
                fontSize: "11px",
                borderBottom: 0,
                px: 2,
                mt:2
              }}
            >
              @ 2025 HighImpactTalentEnquiry | <Link href="mailto:highimpacttalentenquiry@gmail.com">
            highimpacttalentenquiry@gmail.com
          </Link>
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
    </Box>
  );
};

export default TermsOfUsePage;
