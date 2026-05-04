import { Button, Form, Typography, message } from "antd";
import React, { useState } from "react";
import OTPInput from "react-otp-input";
import { useNavigate } from "react-router-dom";
import {
  useOtpVerifyMutation,
  useResendOtpMutation,
} from "../../redux/apiSlices/authSlice";

const { Text } = Typography;

const OtpVerification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const searchParams = new URLSearchParams(window.location.search);
  const email = searchParams.get("email") || "";
  const phone = searchParams.get("phone") || "";
  const [verificationStatus, setVerificationStatus] = useState("");
  const [otpVerify, { isLoading }] = useOtpVerifyMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  const onFinish = async () => {
    if (!otp || otp.length !== 6) {
      setVerificationStatus("Please enter a 6-digit OTP.");
      return;
    }

    if (!phone) {
      message.error("Missing phone number for verification.");
      return;
    }

    try {
      const res = await otpVerify({ phone, oneTimeCode: otp }).unwrap();
      const accessToken = res?.accessToken || res?.token;
      const resetToken = res?.resetToken;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }
      if (resetToken) {
        localStorage.setItem("resetToken", resetToken);
      }

      message.success("Phone verified successfully.");
      navigate(
        `/auth/shop-info?phone=${encodeURIComponent(
          phone
        )}&email=${encodeURIComponent(email)}`
      );
    } catch (err) {
      const errorMsg = err?.data?.message || "OTP verification failed";
      setVerificationStatus(errorMsg);
    }
  };

  const handleResendEmail = async () => {
    if (!phone) {
      message.error("Missing phone number to resend OTP.");
      return;
    }
    try {
      await resendOtp({ phone }).unwrap();
      setVerificationStatus(
        "A new verification code has been sent to your phone."
      );
    } catch (err) {
      const errorMsg = err?.data?.message || "Failed to resend OTP";
      setVerificationStatus(errorMsg);
    }
  };

  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">
          Enter the Verification Code For Verify Your Phone Number
        </h1>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputStyle={{
              height: 40,
              width: 40,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "1px solid #3fae6a",
              color: "#2B2A2A",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        {verificationStatus && (
          <div className="text-center mb-4 text-red-500">
            {verificationStatus}
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <Text>Don't receive the code?</Text>

          <p
            onClick={handleResendEmail}
            className="login-form-forgot"
            style={{ color: "#3fae6a", cursor: "pointer" }}
          >
            Resend
          </p>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            loading={isLoading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center bg-primary hover:bg-green-700 rounded-3xl"
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OtpVerification;
