import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Form,
  Button,
  Select,
  Input,
  Upload,
  message,
  Spin,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { useSendNotificationMutation } from "../../../redux/apiSlices/promoSlice";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
  Circle,
} from "@react-google-maps/api";

// Location Map Picker Component using Google Maps
const LocationMapPicker = ({ onLocationSelect, selectedLocation }) => {
  const [location, setLocation] = useState(
    selectedLocation || { lat: 24.8607, lng: 67.0011 },
  ); // Default to Karachi
  const [showInfoWindow, setShowInfoWindow] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const mapRef = useRef(null);
  const geocoderRef = useRef(null);
  const placesServiceRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Get API Key from environment variable
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const hasValidApiKey =
    GOOGLE_MAPS_API_KEY &&
    GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY" &&
    GOOGLE_MAPS_API_KEY.length > 0;

  const mapContainerStyle = {
    height: "300px",
    width: "100%",
    borderRadius: "8px",
    border: "1px solid #d8d8d8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  };

  const libraries = ["places"];

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const updateSelectedLocation = (newLocation) => {
    setLocation(newLocation);
    onLocationSelect(newLocation);
    setShowInfoWindow(true);

    if (mapRef.current) {
      mapRef.current.panTo(newLocation);
    }
  };

  const searchLocationByName = (value) => {
    const trimmedValue = value.trim();
    setSearchText(value);
    setSearchError("");
    setSuggestions([]);

    if (!trimmedValue || trimmedValue.length < 2) {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setIsSearching(false);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      if (!geocoderRef.current) {
        setSearchError("Map search is not ready yet. Please try again.");
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      geocoderRef.current.geocode(
        { address: trimmedValue },
        (results, status) => {
          setIsSearching(false);

          if (status === "OK" && results?.length > 0) {
            // Filter and map results to suggestions
            const suggestionsList = results
              .slice(0, 8)
              .map((result, index) => ({
                id: index,
                name: result.formatted_address,
                placeId: result.place_id,
                lat: result.geometry.location.lat(),
                lng: result.geometry.location.lng(),
              }));

            setSuggestions(suggestionsList);
            return;
          }

          if (status === "ZERO_RESULTS") {
            setSuggestions([]);
            setSearchError("No matching location found.");
            return;
          }

          setSearchError("Unable to search location right now.");
        },
      );
    }, 300);
  };

  const handleSelectSuggestion = (suggestion) => {
    const newLocation = {
      lat: suggestion.lat,
      lng: suggestion.lng,
    };
    updateSelectedLocation(newLocation);
    setSearchText(suggestion.name);
    setSuggestions([]);
  };

  const handleMapClick = (e) => {
    console.log("Map clicked at:", e.latLng.lat(), e.latLng.lng());
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    updateSelectedLocation(newLocation);
  };

  const handleScriptLoad = () => {
    console.log("Google Map loaded successfully");
    setMapLoaded(true);

    if (window.google?.maps) {
      geocoderRef.current = new window.google.maps.Geocoder();
      if (mapRef.current) {
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          mapRef.current,
        );
      }
    }
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;
  };

  if (!hasValidApiKey) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Select Location on Map
        </label>
        <div style={mapContainerStyle}>
          <div className="text-center">
            <p className="text-red-600 font-medium mb-2">
              ⚠️ Google Maps API Key Not Configured
            </p>
            <p className="text-gray-600 text-sm">
              Please add your Google Maps API Key to the .env file:
            </p>
            <code className="block bg-white p-2 mt-2 text-xs border border-gray-300 rounded">
              VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
            </code>
            <p className="text-gray-500 text-xs mt-2">
              Get your API key from: <br />
              <a
                href="https://console.cloud.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        </div>
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-yellow-800 text-sm">
            <strong>Temporary workaround:</strong> You can manually enter
            latitude and longitude coordinates:
          </p>
          <div className="flex gap-2 mt-2">
            <Input
              type="number"
              placeholder="Latitude (e.g., 24.8607)"
              step="0.0001"
              defaultValue={location.lat}
              onChange={(e) => {
                const newLat = parseFloat(e.target.value);
                setLocation({ ...location, lat: newLat });
              }}
              className="mli-tall-input flex-1"
              onBlur={() => onLocationSelect(location)}
            />
            <Input
              type="number"
              placeholder="Longitude (e.g., 67.0011)"
              step="0.0001"
              defaultValue={location.lng}
              onChange={(e) => {
                const newLng = parseFloat(e.target.value);
                setLocation({ ...location, lng: newLng });
              }}
              className="mli-tall-input flex-1"
              onBlur={() => onLocationSelect(location)}
            />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Current: Latitude: {location.lat.toFixed(4)}, Longitude:{" "}
          {location.lng.toFixed(4)}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-2">
        Select Location on Map
      </label>
      <div className="mb-3 relative">
        <Input
          value={searchText}
          onChange={(e) => searchLocationByName(e.target.value)}
          placeholder="Search location by name (e.g., Gulshan, Dhaka, Times Square)"
          className="mli-tall-input"
          allowClear
          onFocus={() => suggestions.length > 0 && setSuggestions(suggestions)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Type location name to see suggestions instantly.
        </p>
        {isSearching && (
          <p className="text-xs text-blue-600 mt-1">🔍 Searching location...</p>
        )}
        {searchError && (
          <p className="text-xs text-red-600 mt-1">⚠️ {searchError}</p>
        )}

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="absolute top-10 left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSelectSuggestion(suggestion)}
                className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-b-0 text-sm truncate transition"
                type="button"
              >
                <span className="text-blue-600 font-medium">📍 </span>
                {suggestion.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <LoadScript
        googleMapsApiKey={GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={handleScriptLoad}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: location.lat, lng: location.lng }}
          zoom={13}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: true,
            zoomControl: true,
          }}
        >
          {mapLoaded && (
            <>
              <Circle
                center={{ lat: location.lat, lng: location.lng }}
                radius={500} // 500 meters
                options={{
                  fillColor: "#4285F4",
                  fillOpacity: 0.15,
                  strokeColor: "#1967D2",
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                }}
              />
              <Marker
                position={{ lat: location.lat, lng: location.lng }}
                onClick={() => setShowInfoWindow(!showInfoWindow)}
                title={`Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}`}
              >
                {showInfoWindow && (
                  <InfoWindow
                    position={{ lat: location.lat, lng: location.lng }}
                    onCloseClick={() => setShowInfoWindow(false)}
                  >
                    <div
                      style={{
                        backgroundColor: "#fff",
                        padding: "10px",
                        borderRadius: "4px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        minWidth: "180px",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 6px 0",
                          fontSize: "14px",
                          fontWeight: "bold",
                          color: "#1967D2",
                        }}
                      >
                        📍 Selected
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "12px",
                          color: "#333",
                        }}
                      >
                        <strong>Latitude:</strong>
                        <br />
                        {location.lat.toFixed(6)}
                      </p>
                      <p
                        style={{
                          margin: "4px 0",
                          fontSize: "12px",
                          color: "#333",
                        }}
                      >
                        <strong>Longitude:</strong>
                        <br />
                        {location.lng.toFixed(6)}
                      </p>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            </>
          )}
        </GoogleMap>
      </LoadScript>
      <div
        className="mt-3 p-3 bg-green-50 border-2 border-green-400 rounded"
        style={{ animation: "pulse 2s infinite" }}
      >
        <p className="text-green-900 text-sm font-bold">
          ✓ Location Selected & Highlighted
        </p>
        <p className="text-green-800 text-xs mt-2">
          <strong>Latitude:</strong> {location.lat.toFixed(6)}
          <br />
          <strong>Longitude:</strong> {location.lng.toFixed(6)}
        </p>
        <p className="text-green-700 text-xs mt-2">
          📍 Click anywhere on the map to select a different location
        </p>
      </div>
    </div>
  );
};

const { Option } = Select;

// Customer Segment Select Component
const CustomerSegmentSelect = () => {
  return (
    <Form.Item
      name="segment"
      label="All customers (that have transacted with this merchant)"
      rules={[{ required: true, message: "Please select a segment" }]}
    >
      <Select placeholder="Choose segment" className="mli-tall-select">
        <Option value="new_customer">New Customers</Option>
        <Option value="returning_customer">Returning Customers</Option>
        <Option value="loyal_customer">Loyal Customers</Option>
        <Option value="vip_customer">VIP Customers</Option>
        <Option value="all_customer">All Customers</Option>
      </Select>
    </Form.Item>
  );
};

// Points Input Component
const PointsInput = () => {
  return (
    <Form.Item
      name="points"
      label="All customers that have at least x number of points"
      rules={[
        { required: true, message: "Please enter a number" },
        {
          pattern: /^[0-9]+$/,
          message: "Please enter a valid number",
        },
      ]}
    >
      <Input
        placeholder="Enter minimum points (e.g., 100)"
        className="mli-tall-input"
        type="number"
      />
    </Form.Item>
  );
};

// Radius Input Component
const RadiusInput = () => {
  return (
    <Form.Item
      name="radius"
      label="Customers located within x km of radius from the merchant location"
      rules={[
        { required: true, message: "Please enter distance/KM" },
        {
          pattern: /^[0-9]+$/,
          message: "Please enter a valid number",
        },
      ]}
    >
      <Input
        placeholder="Enter radius in km (e.g., 5)"
        className="mli-tall-input"
        type="number"
      />
    </Form.Item>
  );
};

// Promotion Message Component
const PromotionMessage = () => {
  return (
    <Form.Item
      name="additionalInfo"
      label="Promotion/discount message"
      rules={[{ required: false }]}
    >
      <Input.TextArea
        placeholder="Enter additional information here"
        autoSize={{ minRows: 3, maxRows: 6 }}
        className="mli-tall-input"
      />
    </Form.Item>
  );
};

// Image Upload Component
const ImageUpload = ({ uploadedImage, onUploadChange, onRemove }) => {
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG files!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
      return false;
    }
    // Return false to prevent automatic upload - we handle it manually
    return false;
  };

  return (
    <Form.Item name="image" label="Upload Image (JPG/PNG only)">
      <Upload
        listType="picture"
        fileList={uploadedImage}
        beforeUpload={beforeUpload}
        onChange={onUploadChange}
        onRemove={onRemove}
        maxCount={1}
        accept=".jpg,.jpeg,.png"
      >
        <Button
          icon={<UploadOutlined />}
          style={{ borderColor: "#d8d8d8", color: "#1e1e1e" }}
        >
          Click to Upload
        </Button>
      </Upload>
      <p className="text-sm text-gray-500 mt-1">
        Allowed file types: JPG, PNG. Maximum file size: 2MB.
      </p>
    </Form.Item>
  );
};

// Main Notifications Modal Component
const NotificationsModal = ({ visible, onCancel }) => {
  const [uploadedImage, setUploadedImage] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [form] = Form.useForm();
  const [sendNotification, { isLoading }] = useSendNotificationMutation();

  const handleSendNotification = async (values) => {
    try {
      // Validate required fields
      if (!values.segment) {
        message.error("Please select a customer segment");
        return;
      }
      if (!values.additionalInfo) {
        message.error("Please enter a message");
        return;
      }
      if (!selectedLocation) {
        message.error("Please select a location on the map");
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();

      // Map segment values to API format
      const segmentMap = {
        vip_customer: "vip_customer",
        new_customer: "new_customer",
        returning_customer: "returning_customer",
        loyal_customer: "loyal_customer",
        all_customer: "all_customer",
      };

      // Create data object with notification data including location
      const notificationData = {
        message: values.additionalInfo,
        minPoints: parseInt(values.points || 0, 10),
        segment: segmentMap[values.segment] || values.segment,
        radius: parseInt(values.radius || 50000, 10),
        lat: selectedLocation.lat,
        lng: selectedLocation.lng,
      };

      // Append data as JSON string
      formData.append("data", JSON.stringify(notificationData));

      // Add image as binary if uploaded
      if (uploadedImage.length > 0) {
        const file = uploadedImage[0];
        if (file.originFileObj) {
          formData.append("image", file.originFileObj);
        }
      }

      // Send notification with proper headers
      const response = await sendNotification(formData).unwrap();

      onCancel();
      Swal.fire({
        icon: "success",
        title: "Notification Sent!",
        text: `Message has been sent successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
      setUploadedImage([]);
      setSelectedLocation(null);
      form.resetFields();
    } catch (err) {
      console.error("Notification error:", err);
      const errorMsg = err?.data?.message || "Failed to send notification";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMsg,
      });
    }
  };

  const handleCancel = () => {
    setUploadedImage([]);
    setSelectedLocation(null);
    form.resetFields();
    onCancel();
  };

  const handleUploadChange = ({ fileList }) => {
    setUploadedImage(fileList);
  };

  return (
    <Modal
      title="Send Notification"
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      closable={true}
    >
      <Spin spinning={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSendNotification}
          className="flex flex-col gap-4"
        >
          <LocationMapPicker
            onLocationSelect={setSelectedLocation}
            selectedLocation={selectedLocation}
          />

          <CustomerSegmentSelect />

          <PointsInput />

          <RadiusInput />

          <PromotionMessage />

          <ImageUpload
            uploadedImage={uploadedImage}
            onUploadChange={handleUploadChange}
            onRemove={(file) =>
              setUploadedImage((prev) => prev.filter((f) => f.uid !== file.uid))
            }
          />

          <div className="flex gap-2 mt-4">
            <Button
              type="default"
              className="flex-1"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="flex-1"
              loading={isLoading}
            >
              Send
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
};

export default NotificationsModal;
