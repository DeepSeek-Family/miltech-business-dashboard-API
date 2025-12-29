import { Form, Input, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";
import image4 from "../../assets/image4.png";
import { useRegisterMutation } from "../../redux/apiSlices/authSlice";

const SignUp = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const onFinish = async (values) => {
    const payload = {
      firstName: values.name,
      phone: values.phone,
      email: values.email,
      password: values.password,
      role: "MERCENT",
    };

    try {
      await registerUser(payload).unwrap();
      message.success("Registration successful. Please verify OTP.");
      navigate(
        `/auth/otp-verification?phone=${encodeURIComponent(
          values.phone
        )}&email=${encodeURIComponent(values.email)}&type=${encodeURIComponent(
          "signup"
        )}`
      );
    } catch (err) {
      const errorMsg = err?.data?.message || "Registration failed";
      message.error(errorMsg);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-2">
        <img src={image4} alt="logo" className="h-20 w-20 mx-auto" />
        <h1 className="text-[25px] font-semibold mb-[10px] mt-[20px]">
          Merchant Dashboard
        </h1>
        <p>Create an account</p>
      </div>

      {/* Form */}
      <Form
        onFinish={onFinish}
        layout="vertical"
        className="flex flex-col gap-4"
      >
        {/* Name */}
        <Form.Item
          name="name"
          label={<p>Name</p>}
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input
            placeholder="Enter your name"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Email */}
        <Form.Item
          name="email"
          label={<p>Email</p>}
          rules={[
            { required: true, message: "Please enter your email" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                  return Promise.reject(
                    new Error("Please enter a valid email address")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter your email"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          name="phone"
          label={<p>Phone Number</p>}
          rules={[
            { required: true, message: "Please enter your phone number" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                // Allow digits, spaces, hyphens, parentheses, and leading +
                const phoneRegex =
                  /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ""))) {
                  return Promise.reject(
                    new Error("Please enter a valid phone number")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            placeholder="Enter your phone number"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Password */}
        <Form.Item
          name="password"
          label={<p>Password</p>}
          validateTrigger="onChange"
          rules={[
            { required: true, message: "Please enter your password" },
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

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label={<p>Confirm Password</p>}
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm your password"
            style={{
              height: 45,
              border: "1px solid #3FAE6A",
              borderRadius: "200px",
            }}
          />
        </Form.Item>

        {/* Submit button */}
        <Form.Item style={{ marginBottom: 0 }}>
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
              marginTop: 20,
              borderRadius: "200px",
            }}
            className="flex items-center justify-center bg-[#3FAE6A] rounded-lg"
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </Form.Item>
      </Form>

      {/* Footer */}
      <div className="mt-[20px]">
        <p className="text-center text-[#1E1E1E]">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-[#3FAE6A] hover:text-[#1E1E1E] font-semibold"
          >
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
