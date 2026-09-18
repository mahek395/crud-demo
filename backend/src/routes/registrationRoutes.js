const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  createRegistration,
  getRegistrations,
  getRegistrationById,
  updateRegistration,
  deleteRegistration,
} = require('../controllers/registrationController');

router.post('/', upload.single('profile_photo'), createRegistration);
router.get('/', getRegistrations);
router.get('/:id', getRegistrationById);
router.put('/:id', upload.single('profile_photo'), updateRegistration);
router.delete('/:id', deleteRegistration);

module.exports = router;
