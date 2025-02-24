import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utils";
import { useDispatch } from "react-redux";
import { Login } from "../../redux/userSlice";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Card,
  CircularProgress,
} from "@mui/material";

function UserLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newData = { email, password };
      const res = await apiRequest({
        url: "user/login",
        method: "POST",
        data: newData,
      });

      if (res?.status != 200) {
        setErrMsg(res?.message);
        return;     
      } else {
        setErrMsg("");
        const userData = { token: res?.token, ...res?.user };
        dispatch(Login(userData));
        localStorage.setItem("userInfo", JSON.stringify(userData));
        navigate("/find-jobs");
      }
    } catch (error) {
      console.log(error);
      setErrMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ background: "#f4f6f8" }}
      >
        <Card
          sx={{
            p: 4,
            boxShadow: 5,
            borderRadius: 3,
            width: "100%",
            background: "#fff",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={3}
            color="primary"
          >
            Welcome Back!
          </Typography>

          {errMsg && (
            <Typography color="error" textAlign="center" mb={2}>
              {errMsg}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </form>

          <Typography textAlign="center" mt={2}>
            Don't have an account?{" "}
            <Link
              to="/u-authform"
              style={{
                color: "#1976d2",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Card>
      </Box>
    </Container>
  );
}

export default UserLoginForm;
