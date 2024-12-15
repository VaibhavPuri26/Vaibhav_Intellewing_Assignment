import  { useState } from "react";
import { fetchContacts, updateContact } from "../api"; 

const ContactList = ({ contacts, onDelete, onUpdate }) => {
  const [editingContactId, setEditingContactId] = useState(null);
  const [editedContact, setEditedContact] = useState({});
  const [loading, setLoading] = useState(false); 

  
  const handleEdit = (contactId) => {
    setEditingContactId(contactId);
    const contactToEdit = contacts.find((contact) => contact.id === contactId);
    setEditedContact({ ...contactToEdit });
  };

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedContact((prev) => ({ ...prev, [name]: value }));
  };

 
  const handleSave = async () => {
    setLoading(true); 

    try {
      await updateContact(editedContact.id, editedContact); 

 
      const updatedContacts = await fetchContacts();
      onUpdate(updatedContacts.data.contacts); 

      setEditingContactId(null); 
      setEditedContact({}); 
    } catch (error) {
      console.error("Error updating contact:", error);
    } finally {
      setLoading(false); 
    }
  };

  
  const handleCancel = () => {
    setEditingContactId(null); 
    setEditedContact({}); 
  };

  return (
    <div className="overflow-x-auto px-4 shadow-2xl rounded-lg bg-slate-200 backdrop-blur-md p-6 m-10">
  <table className="min-w-full text-sm rounded-lg py-4">
    <thead>
      <tr className="bg-blue-500 text-gray-100 rounded-lg shadow-xl">
        <th className="px-6 py-3 text-left font-semibold">Full Name</th>
        <th className="px-6 py-3 text-left font-semibold">Email</th>
        <th className="px-6 py-3 text-left font-semibold">Primary Phone</th>
        <th className="px-6 py-3 text-left font-semibold">Secondary Phone</th>
        <th className="px-6 py-3 text-left font-semibold">Address</th>
        <th className="px-6 py-3 text-center font-semibold">Actions</th>
      </tr>
    </thead>
    <tbody>
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              className="border-t border-gray-300 hover:bg-gray-100 text-gray-700 font-medium"
            >
              <td className="px-6 py-3">
                {editingContactId === contact.id ? (
                  <input
                    type="text"
                    name="first_name"
                    value={editedContact.first_name || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  `${contact.first_name} ${contact.last_name}`
                )}
              </td>
              <td className="px-6 py-3">
                {editingContactId === contact.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editedContact.email || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  contact.email
                )}
              </td>
              <td className="px-6 py-3">
                {editingContactId === contact.id ? (
                  <input
                    type="text"
                    name="phone_1"
                    value={editedContact.phone_1 || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  contact.phone_1
                )}
              </td>
              <td className="px-6 py-3">
                {editingContactId === contact.id ? (
                  <input
                    type="text"
                    name="phone_2"
                    value={editedContact.phone_2 || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  contact.phone_2
                )}
              </td>
              <td className="px-6 py-3">
                {editingContactId === contact.id ? (
                  <input
                    type="text"
                    name="address"
                    value={editedContact.address || ""}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                ) : (
                  contact.address
                )}
              </td>
              <td className="px-6 py-3 text-center">
                {editingContactId === contact.id ? (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-white rounded-md"
                      disabled={loading}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-md"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => handleEdit(contact.id)}
                      className="px-4 py-2 bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(contact.id)}
                      className="px-4 py-2 bg-gradient-to-r from-red-400 to-pink-500 text-white rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
