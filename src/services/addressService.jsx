import axios from "axios";

const ADDRESS_BASE_URL = "http://localhost:8085/api/addresses"; // Change if needed

// ✅ Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("carocart_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const addressService = {
  // ✅ Get all addresses for current user using /me
  getMyAddresses: async () => {
    const response = await axios.get(
      `${ADDRESS_BASE_URL}/me`,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✅ Create a new address
  createAddress: async (addressData) => {
    const response = await axios.post(
      `${ADDRESS_BASE_URL}`,
      addressData,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✅ Update an existing address
  updateAddress: async (id, addressData) => {
    const response = await axios.put(
      `${ADDRESS_BASE_URL}/${id}`,
      addressData,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✅ Delete an address
  deleteAddress: async (id) => {
    const response = await axios.delete(
      `${ADDRESS_BASE_URL}/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },

  // ✅ Get an address by its ID
  getAddressById: async (id) => {
    const response = await axios.get(
      `${ADDRESS_BASE_URL}/${id}`,
      getAuthHeaders()
    );
    return response.data;
  },
};

export default addressService;
