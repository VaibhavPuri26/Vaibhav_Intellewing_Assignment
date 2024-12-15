import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import ContactList from "../components/ContactList";
import SearchBar from "../components/SearchBar";
import { fetchContacts, deleteContact } from "../api";

const Home = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalContacts: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      loadContacts(pagination.page);
    }
  }, [pagination.page, navigate]);

  const loadContacts = async (page) => {
    try {
      const response = await fetchContacts();
      setContacts(response.data.contacts);
      setFilteredContacts(response.data.contacts);
      setPagination((prev) => ({
        ...prev,
        totalContacts: response.data.contacts.length,
        totalPages: Math.ceil(response.data.contacts.length / prev.limit),
      }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteContact(id);
      const updatedContacts = contacts.filter((contact) => contact.id !== id);
      setContacts(updatedContacts);
      setFilteredContacts(updatedContacts);
      setPagination((prev) => ({
        ...prev,
        totalContacts: updatedContacts.length,
        totalPages: Math.ceil(updatedContacts.length / prev.limit),
      }));
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleSearch = (query) => {
    if (!query) {
      setFilteredContacts(contacts);
    } else {
      const lowerCaseQuery = query.toLowerCase();
      const results = contacts.filter(
        (contact) =>
          contact.first_name.toLowerCase().includes(lowerCaseQuery) ||
          contact.middle_name.toLowerCase().includes(lowerCaseQuery) ||
          contact.last_name.toLowerCase().includes(lowerCaseQuery) ||
          contact.phone_1.toLowerCase().includes(lowerCaseQuery) ||
          contact.phone_2.toLowerCase().includes(lowerCaseQuery) ||
          contact.address.toLowerCase().includes(lowerCaseQuery)
      );
      setFilteredContacts(results);
    }

    setPagination((prev) => ({
      ...prev,
      page: 1,
      totalContacts: filteredContacts.length,
      totalPages: Math.ceil(filteredContacts.length / prev.limit),
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
    }
  };

  const handleSubmit = () => {
    loadContacts(pagination.page);
    setFormVisible(false);
  };

  const handleClose = () => {
    setFormVisible(false);
  };

  const handleUpdate = (updatedContacts) => {
    setContacts(updatedContacts);
    setFilteredContacts(updatedContacts);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="p-4 sm:p-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-700">Contact Book</h1>
      </header>

      <main className="flex-grow container mx-auto py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 bg-slate-200 shadow-lg rounded-lg">
          <SearchBar onSearch={handleSearch} />
          <div className="flex flex-col sm:flex-row items-center mt-4 sm:mt-0 space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setFormVisible(!isFormVisible)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 w-full sm:w-auto"
            >
              {isFormVisible ? "Cancel" : "Add Contact"}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 w-full sm:w-auto"
            >
              Logout
            </button>
          </div>
        </div>

        {isFormVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
            <div className="modal-container">
              <ContactForm onSubmit={handleSubmit} onClose={handleClose} />
            </div>
          </div>
        )}

        <ContactList
          contacts={filteredContacts.slice(
            (pagination.page - 1) * pagination.limit,
            pagination.page * pagination.limit
          )}
          onDelete={handleDeleteContact}
          onUpdate={handleUpdate}
        />

        <div className="flex justify-center mt-6 space-x-4">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:via-teal-600 hover:to-green-600 disabled:opacity-70"
            disabled={pagination.page <= 1}
          >
            Previous
          </button>
          <span className="self-center text-lg">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 via-teal-500 to-green-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:via-teal-600 hover:to-green-600 disabled:opacity-70"
            disabled={pagination.page >= pagination.totalPages}
          >
            Next
          </button>
        </div>
      </main>

      <footer className="py-3 text-center bg-gray-200 text-gray-700 w-full">
        © 2024 Contact Book - All Rights Reserved
      </footer>
    </div>
  );
};

export default Home;
