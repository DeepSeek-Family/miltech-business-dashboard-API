import { useState, useRef, useEffect } from "react";
import JoditEditor from "jodit-react";
import { Button, message, Modal } from "antd";
import {
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
} from "../../redux/apiSlices/termsAndConditionSlice";

const TermsAndConditions = () => {
  const editor = useRef(null);

  const {
    data: termsData,
    isLoading,
    isError,
  } = useGetTermsAndConditionsQuery();

  const [updateTermsAndConditions, { isLoading: isUpdating }] =
    useUpdateTermsAndConditionsMutation();

  // Initialize content state from API data or default
  const [termsContent, setTermsContent] = useState(
    termsData?.data?.content ||
      "<p>Your terms and conditions content goes here.</p>"
  );

  // Update state when API data loads
  useEffect(() => {
    if (termsData?.data?.content) {
      setTermsContent(termsData.data.content);
    }
  }, [termsData?.data?.content]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      // Send update request to API
      await updateTermsAndConditions({ content: termsContent }).unwrap();
      setIsModalOpen(false);
      message.success("Terms & Conditions updated successfully!");
    } catch (error) {
      message.error("Failed to update Terms & Conditions");
      console.error("Update error:", error);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="">
      <div className="flex justify-start items-end mb-6">
        <h2 className="text-xl font-bold">Terms & Conditions</h2>
        {/* <Button
          onClick={showModal}
          className="bg-primary px-8 py-5 rounded-full text-white hover:text-secondary text-[17px] font-bold"
        >
          Update Terms & Conditions
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
            {isUpdating ? "Updating..." : "Update Terms & Conditions"}
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

export default TermsAndConditions;
