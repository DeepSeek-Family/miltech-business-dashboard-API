import { Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import { useLoginMutation } from "../../redux/apiSlices/authSlice";
import { useUser } from "../../provider/User";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { getFCMToken, getStoredFCMToken } from "../../utils/fcmService";

const Login = () => {
  const navigate = useNavigate();
  const { refetch } = useUser();
  const [login, { isLoading }] = useLoginMutation();
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleLoading(true);
    try {
      let fcmToken = await getFCMToken();
      if (!fcmToken) {
        fcmToken = getStoredFCMToken();
      }

      const googlePayload = {
        idToken: credentialResponse.credential,
        role: "MERCENT",
        fcmToken: fcmToken, // Always include token
      };

      const response = await fetch("http://10.10.7.8:5004/api/v1/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(googlePayload),
      });

      const data = await response.json();
      console.log("Google auth response:", data);

      if (response.ok && data?.data?.accessToken) {
        message.success("Google login successful!");

        // Save token from response - check various possible field names
        const token = data.data?.accessToken || data.accessToken || data.token;
        if (token) {
          localStorage.setItem("token", token);
          console.log(
            "Token saved successfully:",
            token.substring(0, 20) + "...",
          );

          if (data.data?.refreshToken || data.refreshToken) {
            localStorage.setItem(
              "refreshToken",
              data.data?.refreshToken || data.refreshToken,
            );
          }

          // Refetch profile after login
          try {
            await refetch();
          } catch (error) {
            console.warn("Profile fetch delayed:", error);
          }

          // Check role and redirect accordingly
          const userRole = data.data?.user?.role || data.data?.role;
          const redirectPath =
            userRole === "VIEW_MERCENT" ? "/sell-management" : "/";

          // Add delay and navigate
          setTimeout(() => {
            navigate(redirectPath, { replace: true });
          }, 500);
        } else {
          message.error("Token not found in response");
          console.error("Token not in response:", data);
        }
      } else {
        message.error(data.message || "Google login failed");
        console.error("Google auth failed:", data);
      }
    } catch (error) {
      console.error("Google login error:", error);
      message.error("An error occurred during Google login");
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    message.error("Google login failed. Please try again.");
  };

  const onFinish = async (values) => {
    console.log("📝 Login started...");

    // Get FCM token
    console.log("🔄 Getting FCM token...");
    let fcmToken = await getFCMToken();
    if (!fcmToken) {
      fcmToken = getStoredFCMToken();
    }
    console.log(
      "✓ Token result:",
      fcmToken ? `✅ ${fcmToken.substring(0, 20)}...` : "❌ No token",
    );

    const payload = {
      identifier: values.email,
      password: values.password,
      device: "merchant",
      fcmToken: fcmToken, // Always include token (FCM or device ID)
    };

    console.log("📤 Final payload:", payload);

    try {
      const result = await login(payload).unwrap();

      localStorage.setItem("token", result?.data?.accessToken);

      if (result?.data?.refreshToken) {
        localStorage.setItem("refreshToken", result.data.refreshToken);
      }

      message.success("Login successful!");

      // Refetch profile after login
      try {
        await refetch();
      } catch (error) {
        console.warn("Profile fetch delayed:", error);
      }

      // Check role and redirect accordingly
      const userRole = result?.data?.user?.role || result?.data?.role;
      const redirectPath =
        userRole === "VIEW_MERCENT" ? "/sell-management" : "/";

      // Navigate to appropriate dashboard
      navigate(redirectPath, { replace: true });
    } catch (err) {
      message.error(err?.data?.message || "Login failed!");
    }
  };

  return (
    <GoogleOAuthProvider clientId="593611426236-c0aqlvlgbg1jnd5lm3tjmnqjurevdljh.apps.googleusercontent.com">
      <div>
        <div className="text-center mb-8">
          <img src={image4} alt="logo" className="h-40 w-40 mx-auto" />
          <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
            Merchant Dashboard
          </h1>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <Form
          onFinish={onFinish}
          layout="vertical"
          className="flex flex-col gap-4"
        >
          <FormItem name={"email"} label={"Phone/Email"} />

          <Form.Item
            name="password"
            label={<p>Password</p>}
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{
                height: 45,
                border: "1px solid #3FAE6A",
                borderRadius: "200px",
              }}
            />
          </Form.Item>

          <div className="flex items-center justify-end">
            <a
              className="login-form-forgot text-[#1E1E1E] hover:text-[#3FAE6A] rounded-md font-semibold"
              href="/auth/forgot-password"
            >
              Forgot password
            </a>
          </div>

          <Form.Item style={{ marginBottom: 0 }}>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
              style={{
                width: "100%",
                height: 45,
                color: "white",
                fontSize: "18px",
                marginTop: 20,
                borderRadius: "200px",
              }}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </Form.Item>

          {/* Google Login Button */}
          <div className="flex justify-center mb-6 mt-4">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              text="signin_with"
              width="350"
            />
          </div>

          <div className="mt-[20px]">
            <p className="text-center text-[#1E1E1E]">
              Don't have an account?{" "}
              <a
                href="/auth/signup"
                className="text-[#3FAE6A] hover:text-[#1E1E1E] font-semibold"
              >
                Sign Up
              </a>
            </p>
          </div>
        </Form>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
