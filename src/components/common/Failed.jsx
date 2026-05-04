import { Link } from "react-router-dom";

const Failed = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-baseBg">
      <div className="text-center px-4">
        {/* Failed Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Failed Message */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Failed!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Something went wrong. Please try again later.
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

export default Failed;
