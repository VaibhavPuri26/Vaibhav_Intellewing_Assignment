const express = require("express");
const router = express.Router();
const db = require("../server");

router.get("/", async(req, res) => {

    
    const { page = 1, limit = 20, search = "" } = req.query;
    const offset = (page - 1) * limit;

    let query = `SELECT * FROM contacts WHERE is_deleted = FALSE `;
    let countQuery = `SELECT COUNT(*) AS total FROM contacts WHERE is_deleted = FALSE `;

    if (search) {
        query += `AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ?) `;
        countQuery += `AND (first_name LIKE ? OR middle_name LIKE ? OR last_name LIKE ?) `;
    }

    query += `ORDER BY first_name, middle_name, last_name LIMIT ? OFFSET ?`;
    const searchParams = search ? [`%${search}%`, `%${search}%`, `%${search}%`, +limit, +offset] : [+limit, +offset];

    try {
        
        const [countResult] = await db.query(countQuery, search ? [`%${search}%`, `%${search}%`, `%${search}%`] : []);
        const totalContacts = countResult[0].total;
        const totalPages = Math.ceil(totalContacts / limit);

       
        const [contacts] = await db.query(query, searchParams);

       
        return res.status(200).json({ contacts, page: +page, totalPages });

    } catch (err) {
        console.error("Error fetching contacts:", err);
        res.status(500).json({ error: "Error fetching contacts" });
    }
});


router.post("/", async(req, res) => {
    const { first_name, middle_name, last_name, email, phone_1, phone_2, address, is_deleted } = req.body;

    try {
        const result = await db.query(
            "INSERT INTO contacts (first_name, middle_name, last_name, email, phone_1, phone_2, address, is_deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [first_name, middle_name, last_name, email, phone_1, phone_2, address, is_deleted || false]
        );
        res.status(201).json({ message: "Contact added successfully", contactId: result[0].insertId });
    } catch (error) {
        console.error("Error adding contact:", error);
        res.status(500).json({ error: "Error adding contact" });
    }
});



router.put("/:id", async(req, res) => {
    const { id } = req.params;
    const { first_name, middle_name, last_name, email, phone_1, phone_2, address } = req.body;

   
    const fields = [];
    const values = [];

  
    if (first_name !== undefined) {
        fields.push("first_name = ?");
        values.push(first_name);
    }
    if (middle_name !== undefined) {
        fields.push("middle_name = ?");
        values.push(middle_name);
    }
    if (last_name !== undefined) {
        fields.push("last_name = ?");
        values.push(last_name);
    }
    if (email !== undefined) {
        fields.push("email = ?");
        values.push(email);
    }
    if (phone_1 !== undefined) {
        fields.push("phone_1 = ?");
        values.push(phone_1);
    }
    if (phone_2 !== undefined) {
        fields.push("phone_2 = ?");
        values.push(phone_2);
    }
    if (address !== undefined) {
        fields.push("address = ?");
        values.push(address);
    }

   
    if (fields.length === 0) {
        return res.status(400).json({ message: "No fields to update" });
    }

   
    const query = `UPDATE contacts SET ${fields.join(", ")} WHERE id = ?`;
    values.push(id); 

    try {
        const [results] = await db.query(query, values);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({ message: "Contact updated successfully", results });
    } catch (err) {
        console.error("Error updating contact:", err);
        res.status(500).json({ error: "Error updating contact" });
    }
});


router.delete("/:id", async(req, res) => {
    const { id } = req.params;
    const query = `UPDATE contacts SET is_deleted = TRUE WHERE id = ?`;

    try {
        const [results] = await db.query(query, [id]);

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json({ message: "Contact soft deleted successfully" });
    } catch (err) {
        console.error("Error soft deleting contact:", err);
        res.status(500).json({ error: "Error soft deleting contact" });
    }
});


module.exports = router;