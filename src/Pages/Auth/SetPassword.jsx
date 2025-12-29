import { Button, ConfigProvider, Form, Input } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import keyIcon from "../../assets/key.png";
import { ArrowLeft } from "lucide-react";
import { useResetPasswordMutation } from "../../redux/apiSlices/authSlice";
import Swal from "sweetalert2";

const SetPassword = () => {
  const phone = new URLSearchParams(location.search).get("phone");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    try {
      const resetToken = localStorage.getItem("resetToken");

      if (!resetToken) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Reset token not found. Please try again.",
        });
        navigate("/auth/forgot-password");
        return;
      }

      // Send reset password request with resetToken in headers
      const response = await resetPassword({
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
        headers: {
          Authorization: resetToken,
        },
      }).unwrap();

      Swal.fire({
        icon: "success",
        title: "Password Reset",
        text: "Your password has been reset successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      // Clear tokens
      localStorage.removeItem("resetToken");
      localStorage.removeItem("token");

      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (error) {
      const errorMessage =
        error?.data?.message ||
        error?.data?.errorMessages?.[0]?.message ||
        error?.message ||
        "Failed to reset password";
      Swal.fire({
        icon: "error",
        title: "Password Reset Failed",
        text: errorMessage,
      });
    }
  };

  return (
    <div>
      <img src={keyIcon} alt="KeyIcon" className="mb-[24px] mx-auto" />
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Set new password</h1>
        <p className="w-[90%] mx-auto text-base">
          Your new password must be different to previously used passwords.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish} className="flex flex-col gap-6">
        <Form.Item
          name="newPassword"
          label={
            <p
              style={{
                display: "block",
                color: "#5C5C5C",
              }}
              htmlFor="email"
              className="font-semibold "
            >
              New Password
            </p>
          }
          validateTrigger="onChange"
          rules={[
            {
              required: true,
              message: "Please input your new Password!",
            },
            {
              validator(_, value) {
                if (!value) return Promise.resolve();

                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialChar =
                  /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);

                if (
                  hasUpperCase &&
                  hasLowerCase &&
                  hasNumber &&
                  hasSpecialChar
                ) {
                  return Promise.resolve();
                }

                const missing = [];
                if (!hasUpperCase) missing.push("uppercase letter");
                if (!hasLowerCase) missing.push("lowercase letter");
                if (!hasNumber) missing.push("number");
                if (!hasSpecialChar) missing.push("special character");

                return Promise.reject(
                  new Error(
                    `Password must contain at least one ${missing.join(
                      ", one "
                    )}`
                  )
                );
              },
            },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Input.Password
            type="password"
            placeholder="Enter New password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "200px",
              outline: "none",
            }}
          />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 0 }}
          label={
            <p
              style={{
                display: "block",
                color: "#5C5C5C",
              }}
              htmlFor="email"
              className="font-semibold"
            >
              Confirm Password
            </p>
          }
          name="confirmPassword"
          dependencies={["newPassword"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter Confirm password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              background: "white",
              borderRadius: "200px",
              outline: "none",
            }}
          />
        </Form.Item>

        <Form.Item>
          <button
            htmlType="submit"
            type="submit"
            disabled={isLoading}
            style={{
              width: "100%",
              height: 45,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              borderRadius: "200px",
              marginTop: 20,
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? "not-allowed" : "pointer",
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            {isLoading ? "Resetting..." : "Submit"}
          </button>
        </Form.Item>
      </Form>
      <div className="">
        <a
          href="/auth/login"
          className="flex items-center justify-center gap-1 text-[#667085] hover:text-[#3FAE6A] text-center mt-4"
        >
          <ArrowLeft size={20} />
          <p>Back to log in</p>
        </a>
      </div>
    </div>
  );
};

export default SetPassword;
