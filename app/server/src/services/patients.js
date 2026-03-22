const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(patients);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth, gender, phone } = req.body;

    if (!firstName || !lastName || !dateOfBirth || !gender || !phone) {
      return res.status(400).json({
        message:
          'firstName, lastName, dateOfBirth, gender, and phone are required.',
      });
    }

    const patient = await prisma.patient.create({
      data: {
        patientId: req.body.patientId || randomId('PAT'),
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: String(gender).toUpperCase(),
        phone,
        email: req.body.email,
        address: req.body.address,
        bloodGroup: req.body.bloodGroup,
        allergies: req.body.allergies || [],
        emergencyContact: req.body.emergencyContact,
        diagnosisHistory: req.body.diagnosisHistory || [],
        treatmentHistory: req.body.treatmentHistory || [],
        prescriptions: req.body.prescriptions || [],
      },
    });

    return res.status(201).json(patient);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const patient = await prisma.patient.update({
      where: { id: req.params.id },
      data: {
        patientId: req.body.patientId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth
          ? new Date(req.body.dateOfBirth)
          : undefined,
        gender: req.body.gender
          ? String(req.body.gender).toUpperCase()
          : undefined,
        phone: req.body.phone,
        email: req.body.email,
        address: req.body.address,
        bloodGroup: req.body.bloodGroup,
        allergies: req.body.allergies || [],
        emergencyContact: req.body.emergencyContact,
        diagnosisHistory: req.body.diagnosisHistory || [],
        treatmentHistory: req.body.treatmentHistory || [],
        prescriptions: req.body.prescriptions || [],
        isActive: req.body.isActive,
      },
    });

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.patient.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Patient deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
