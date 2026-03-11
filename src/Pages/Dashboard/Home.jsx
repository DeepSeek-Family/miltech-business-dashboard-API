import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarChart from "./BarChart";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import OrderTable from "../../components/home/OrderTable";
import { Rewords } from "../../components/common/Svg";
import { People } from "../../components/common/Svg";
import { Sales } from "../../components/common/Svg";
import { Points } from "../../components/common/Svg";
import PieChart from "./PieChart";
import { useGetStatsQuery } from "../../redux/apiSlices/homeSlice";
import { useUser } from "../../provider/User";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Home = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("7d");

  // Redirect VIEW_MERCENT to Sell Management
  useEffect(() => {
    const userRole = user?.user?.role || user?.role;
    if (userRole === "VIEW_MERCENT") {
      navigate("/sell-management", { replace: true });
    }
  }, [user, navigate]);

  // Map display text to API values
  const optionsMap = {
    today: "Today",
    "7d": "Last 7 Days",
    "1m": "Last 30 Days",
    all: "All Time",
  };

  const queryParams = [{ name: "range", value: selected }];

  const { data: response, isLoading, isError } = useGetStatsQuery(queryParams);

  console.log(response);

  const options2 = ["today", "7d", "1m", "all"];

  // Handle dropdown change
  const handleRangeChange = (option) => {
    setSelected(option);
    setIsOpen(false);
  };

  // Show loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Show error state
  if (isError) {
    return <div>Error loading data.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row gap-6 rounded-lg">
        {/* Pie Chart Section */}
        <div className="flex-1 border border-primary bg-[#D7F4DE] rounded-lg p-6">
          <PieChart />
        </div>

        {/* Bar Chart Section */}
        <div className="flex-1 border border-primary bg-[#D7F4DE] rounded-lg p-6">
          <BarChart />
        </div>

        {/* Card Section */}
        <div className="w-full xl:w-1/3 bg-[#D7F4DE] border border-primary p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4 text-white">
            <h2 className="text-secondary mt-4 text-[24px] font-bold">
              Statistics
            </h2>
            <div className="relative inline-block w-[150px]">
              {/* Dropdown Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full font-medium text-[14px] py-[8px] px-[16px] border border-primary text-secondary rounded-lg text-left flex justify-between items-center"
              >
                {optionsMap[selected]}
                <span className="ml-2">▼</span>
              </button>

              {/* Dropdown Options */}
              {isOpen && (
                <ul className="absolute z-10 w-full bg-white border border-primary rounded-lg mt-1 shadow-lg">
                  {options2.map((option) => (
                    <li
                      key={option}
                      onClick={() => handleRangeChange(option)}
                      className="cursor-pointer px-4 py-2 text-black hover:bg-primary/10"
                    >
                      {optionsMap[option]}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-white border border-primary rounded-lg flex items-center justify-start p-6">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">Total Sales</h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Sales className="w-[20px] h-[20px] text-secondary" />
                  {response?.data?.totalSales || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-start p-6">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Total Members
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <People className="w-[20px] h-[20px] text-secondary" />
                  {response?.data?.totalMembers || 0}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-start p-6">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Total Points Issued
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Points className="w-[20px] h-[20px] text-secondary" />
                  {(response?.data?.totalPointsIssued || 0).toFixed(2)}
                </h3>
              </div>
            </div>

            <div className="bg-white border border-primary rounded-lg flex items-center justify-start p-6">
              <div className="flex flex-col items-baseline">
                <h2 className="text-[16px] font-semibold mb-1">
                  Rewards Redeemed
                </h2>
                <h3 className="text-secondary text-[24px] font-semibold flex items-center gap-3">
                  <Rewords className="w-[20px] h-[20px] text-secondary" />
                  {response?.data?.rewardsRedeemed || 0}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Table */}
      <div>
        <OrderTable />
      </div>
    </div>
  );
};

export default Home;
