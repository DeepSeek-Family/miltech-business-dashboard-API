import { useState, useEffect } from "react";
import { Select, Input, Card, DatePicker } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface Currency {
  code: string;
  name: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: "AED", name: "UAE Dirham", flag: "🇦🇪" },
  { code: "BDT", name: "Bangladeshi Taka", flag: "🇧🇩" },
  { code: "QAR", name: "Qatari Riyal", flag: "🇶🇦" },
  { code: "SAR", name: "Saudi Riyal", flag: "🇸🇦" },
  { code: "GBP", name: "British Pound Sterling", flag: "🇬🇧" },
  { code: "BHD", name: "Bahraini Dinar", flag: "🇧🇭" },
  { code: "OMR", name: "Omani Rial", flag: "🇴🇲" },
  { code: "KWD", name: "Kuwaiti Dinar", flag: "🇰🇼" },
];

export default function CurrencyConversion() {
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());
  const [selectedCurrency, setSelectedCurrency] = useState<string>(
    "Please select a country",
  );
  const [transactionAmount, setTransactionAmount] = useState<string>("");
  const [conversionFromPKR, setConversionFromPKR] = useState<string>("");
  const [conversionToPKR, setConversionToPKR] = useState<string>("");
  const [equivPKR, setEquivPKR] = useState<string>("0.00");

  // Calculate equivalent PKR automatically
  useEffect(() => {
    const amount = parseFloat(transactionAmount) || 0;
    const fromRate = parseFloat(conversionFromPKR) || 0;
    const toRate = parseFloat(conversionToPKR) || 0;

    if (amount > 0 && toRate > 0) {
      // If converting TO PKR: amount * toRate
      const result = amount * toRate;
      setEquivPKR(result.toFixed(2));
    } else if (amount > 0 && fromRate > 0) {
      // If converting FROM PKR: amount / fromRate
      const result = amount / fromRate;
      setEquivPKR(result.toFixed(2));
    } else {
      setEquivPKR("0.00");
    }
  }, [transactionAmount, conversionFromPKR, conversionToPKR]);

  const handleCurrencyChange = (value: string) => {
    setSelectedCurrency(value);
  };

  const selectedCurrencyData = currencies.find(
    (c) => c.code === selectedCurrency,
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4 ">
          <div>
            <h1 className="text-[24px] font-bold">
              Currency Conversion Calculator
            </h1>
            <p className="text-[16px] font-normal">
              Convert currencies to PKR instantly
            </p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-md rounded-2xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-green-600 p-4 md:p-4 -m-6 mb-6">
            <h2 className="text-white text-xl md:text-2xl font-semibold">
              PKR Conversion
            </h2>
          </div>

          {/* Desktop View - Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-primary">
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Date
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Country
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Transaction Amount
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Conversion from PKR
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Conversion to PKR
                  </th>
                  <th className="px-4 py-4 text-left text-sm font-semibold text-gray-700">
                    Equiv. PKR
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-6">
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => setSelectedDate(date || dayjs())}
                      size="large"
                      className="w-full"
                      format="MMM DD, YYYY"
                    />
                  </td>
                  <td className="px-4 py-6">
                    <Select
                      value={selectedCurrency}
                      onChange={handleCurrencyChange}
                      className="w-full min-w-[250px]"
                      size="large"
                      showSearch
                      optionFilterProp="children"
                    >
                      {currencies.map((currency) => (
                        <Option key={currency.code} value={currency.code}>
                          {currency.code} - {currency.name}
                        </Option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-6">
                    <Input
                      type="number"
                      placeholder="Enter amount"
                      value={transactionAmount}
                      onChange={(e) => setTransactionAmount(e.target.value)}
                      size="large"
                      prefix={selectedCurrencyData?.flag}
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-6">
                    <Input
                      type="number"
                      placeholder="Rate from PKR"
                      value={conversionFromPKR}
                      onChange={(e) => {
                        setConversionFromPKR(e.target.value);
                        if (e.target.value) setConversionToPKR("");
                      }}
                      size="large"
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-6">
                    <Input
                      type="number"
                      placeholder="Rate to PKR"
                      value={conversionToPKR}
                      onChange={(e) => {
                        setConversionToPKR(e.target.value);
                        if (e.target.value) setConversionFromPKR("");
                      }}
                      size="large"
                      className="w-full"
                    />
                  </td>
                  <td className="px-4 py-6 min-w-[200px]">
                    <div className="bg-gradient-to-r from-primary to-green-600 text-white px-4 py-3 rounded-lg text-center">
                      <div className="text-xs font-medium mb-1">PKR</div>
                      <div className="text-2xl font-bold">
                        {parseFloat(equivPKR).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet View - Card Layout */}
          <div className="lg:hidden space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Date
              </label>
              <DatePicker
                value={selectedDate}
                onChange={(date) => setSelectedDate(date || dayjs())}
                size="large"
                className="w-full"
                format="MMM DD, YYYY"
              />
            </div>

            {/* Country Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Country
              </label>
              <Select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                className="w-full"
                size="large"
                showSearch
                optionFilterProp="children"
              >
                {currencies.map((currency) => (
                  <Option key={currency.code} value={currency.code}>
                    <span className="text-lg">{currency.flag}</span>{" "}
                    {currency.code} - {currency.name}
                  </Option>
                ))}
              </Select>
            </div>

            {/* Transaction Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Transaction Amount
              </label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                size="large"
                prefix={selectedCurrencyData?.flag}
                className="w-full"
              />
            </div>

            {/* Conversion Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Conversion from PKR
                </label>
                <Input
                  type="number"
                  placeholder="Rate from PKR"
                  value={conversionFromPKR}
                  onChange={(e) => {
                    setConversionFromPKR(e.target.value);
                    if (e.target.value) setConversionToPKR("");
                  }}
                  size="large"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Conversion to PKR
                </label>
                <Input
                  type="number"
                  placeholder="Rate to PKR"
                  value={conversionToPKR}
                  onChange={(e) => {
                    setConversionToPKR(e.target.value);
                    if (e.target.value) setConversionFromPKR("");
                  }}
                  size="large"
                  className="w-full"
                />
              </div>
            </div>

            <div className="min-w-[200px]">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Equivalent PKR
              </label>
              <div className="bg-gradient-to-r from-primary to-green-600 text-white px-6 py-6 rounded-xl text-center shadow-lg">
                <div className="text-sm font-medium mb-2 opacity-90">
                  PKR Amount
                </div>
                <div className="text-4xl font-bold">
                  {parseFloat(equivPKR).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Enter either "Conversion from PKR" or
              "Conversion to PKR" based on your conversion direction. The result
              will be calculated automatically as you type.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
