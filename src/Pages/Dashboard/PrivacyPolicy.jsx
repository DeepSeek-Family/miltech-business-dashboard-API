import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button, message, Modal } from "antd";
import {
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPolicyMutation,
} from "../../redux/apiSlices/privacyPolicySlice";

const PrivacyPolicy = () => {
  const editor = useRef(null);

  const {
    data: privacyPolicyData,
    isLoading,
    isError,
  } = useGetPrivacyPolicyQuery();

  const [updatePrivacyPolicy, { isLoading: isUpdating }] =
    useUpdatePrivacyPolicyMutation();

  // Initialize content state from API data or default
  const [termsContent, setTermsContent] = useState(
    privacyPolicyData?.data?.content ||
      "<p>Your privacy policy content goes here.</p>"
  );

  // Update state when API data loads
  useEffect(() => {
    if (privacyPolicyData?.data?.content) {
      setTermsContent(privacyPolicyData.data.content);
    }
  }, [privacyPolicyData?.data?.content]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      // Send update request to API
      await updatePrivacyPolicy({ content: termsContent }).unwrap();
      setIsModalOpen(false);
      message.success("Privacy Policy updated successfully!");
    } catch (error) {
      message.error("Failed to update Privacy Policy");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="flex justify-start items-end mb-6">
        <h2 className="text-xl font-bold">Privacy Policy</h2>
        {/* <Button
          onClick={showModal}
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
        >
          Update Privacy Policy
        </Button> */}
      </div>

      <div className="saved-content mt-6 border p-6 rounded-lg bg-white">
        <div
          dangerouslySetInnerHTML={{ __html: termsContent }}
          className="prose max-w-none"
        />
      </div>

      <Modal
        title="Update Terms & Conditions"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width="65%"
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            className="bg-red-500 text-white mr-2 py-5"
          >
            Cancel
          </Button>,
          <Button
            key="submit"
            onClick={handleOk}
            disabled={isUpdating}
            className="bg-secondary text-white"
          >
            {isUpdating ? "Updating..." : "Update Privacy Policy"}
          </Button>,
        ]}
      >
        {isModalOpen && (
          <div className="mb-6">
            <JoditEditor
              ref={editor}
              value={termsContent}
              onChange={(newContent) => {
                setTermsContent(newContent);
              }}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PrivacyPolicy;
