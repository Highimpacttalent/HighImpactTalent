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
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function UserLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      if (res?.success !== true) {
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
    <Box sx={{ background: "#fff" }}>
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Box sx={{ width: { xs: "90%", md: "50%" } }}>
          <Typography
            variant="h4"
            fontWeight="700"
            fontFamily="Satoshi"
            fontSize="32px"
            textAlign="center"
            mb={3}
            color="rgba(64, 66, 88, 1)"
          >
            Login
          </Typography>

          {errMsg && (
            <Typography color="error" textAlign="center" mb={2}>
              {errMsg}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)">
              Email Address
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{
                "& .MuiOutlinedInput-root": { borderRadius: 16, mb: 1 },
              }}
            />
            <Typography fontWeight="700" fontFamily="Satoshi" color="rgba(64, 66, 88, 1)">
              Password
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 16 } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{}}>
                      {showPassword ? <Visibility />:<VisibilityOff /> }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Forgot Password Link */}
            <Typography textAlign="right" mt={2}>
              <Link
                to="/password"
                style={{
                  color: "rgba(60, 126, 252, 1)",
                  textDecoration: "none",
                  fontWeight: "bold",
                  fontFamily: "Satoshi",
                  fontSize: "16px",
                }}
              >
                Forgot Password?
              </Link>
            </Typography>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              sx={{
                mt: 2,
                py: 1.5,
                borderRadius: 16,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
            </Button>
          </form>

          <Typography textAlign="center" mt={4} color="rgba(128, 129, 149, 1)">
            Don't have an account?{" "}
            <Link to="/u-authform" style={{ color: "rgba(60, 126, 252, 1)", textDecoration: "none" }}>
              Create Account
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default UserLoginForm;
