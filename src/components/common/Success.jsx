import { Link } from "react-router-dom";

const Success = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-baseBg">
      <div className="text-center px-4">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Success!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Your payment has been completed successfully.
        </p>

        {/* Action Button */}
        {/* <Link
          to="/"
          className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all duration-200"
        >
          Back to Dashboard
        </Link> */}
      </div>
    </div>
  );
};

export default Success;
