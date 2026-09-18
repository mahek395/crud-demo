const pool = require('../config/db');
const fs = require('fs');
const path = require('path');

// CREATE
exports.createRegistration = async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      course_category,
      preferred_batch,
      start_date,
      prior_experience,
      placement_assistance,
      agree_terms,
    } = req.body;

    if (!full_name || !email || !phone || !course_category || !preferred_batch || !start_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const profile_photo = req.file ? `/uploads/${req.file.filename}` : null;

    const [result] = await pool.query(
      `INSERT INTO course_registrations
        (full_name, email, phone, profile_photo, course_category, preferred_batch, start_date, prior_experience, placement_assistance, agree_terms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        full_name,
        email,
        phone,
        profile_photo,
        course_category,
        preferred_batch,
        start_date,
        prior_experience || null,
        placement_assistance === 'true' || placement_assistance === true,
        agree_terms === 'true' || agree_terms === true,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM course_registrations WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email already registered' });
    }
    res.status(500).json({ message: 'Server error creating registration' });
  }
};

// READ ALL
exports.getRegistrations = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM course_registrations ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching registrations' });
  }
};

// READ ONE
exports.getRegistrationById = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM course_registrations WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error fetching registration' });
  }
};

// UPDATE
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const [existingRows] = await pool.query('SELECT * FROM course_registrations WHERE id = ?', [id]);
    if (existingRows.length === 0) return res.status(404).json({ message: 'Not found' });
    const existing = existingRows[0];

    const {
      full_name = existing.full_name,
      email = existing.email,
      phone = existing.phone,
      course_category = existing.course_category,
      preferred_batch = existing.preferred_batch,
      start_date = existing.start_date,
      prior_experience = existing.prior_experience,
      placement_assistance = existing.placement_assistance,
      agree_terms = existing.agree_terms,
    } = req.body;

    let profile_photo = existing.profile_photo;
    if (req.file) {
      if (existing.profile_photo) {
        const oldPath = path.join(__dirname, '../../', existing.profile_photo);
        fs.unlink(oldPath, () => {});
      }
      profile_photo = `/uploads/${req.file.filename}`;
    }

    await pool.query(
      `UPDATE course_registrations SET
        full_name = ?, email = ?, phone = ?, profile_photo = ?, course_category = ?,
        preferred_batch = ?, start_date = ?, prior_experience = ?, placement_assistance = ?, agree_terms = ?
       WHERE id = ?`,
      [
        full_name,
        email,
        phone,
        profile_photo,
        course_category,
        preferred_batch,
        start_date,
        prior_experience,
        placement_assistance === 'true' || placement_assistance === true,
        agree_terms === 'true' || agree_terms === true,
        id,
      ]
    );

    const [rows] = await pool.query('SELECT * FROM course_registrations WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error updating registration' });
  }
};

// DELETE
exports.deleteRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const [existingRows] = await pool.query('SELECT * FROM course_registrations WHERE id = ?', [id]);
    if (existingRows.length === 0) return res.status(404).json({ message: 'Not found' });

    if (existingRows[0].profile_photo) {
      const oldPath = path.join(__dirname, '../../', existingRows[0].profile_photo);
      fs.unlink(oldPath, () => {});
    }

    await pool.query('DELETE FROM course_registrations WHERE id = ?', [id]);
    res.json({ message: 'Registration deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error deleting registration' });
  }
};
