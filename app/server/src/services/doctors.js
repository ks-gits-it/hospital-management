const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(doctors);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, specialization, department, phone } = req.body;

    if (!firstName || !lastName || !specialization || !department || !phone) {
      return res.status(400).json({
        message:
          'firstName, lastName, specialization, department, and phone are required.',
      });
    }

    const doctor = await prisma.doctor.create({
      data: {
        doctorId: req.body.doctorId || randomId('DOC'),
        firstName,
        lastName,
        specialization,
        department,
        phone,
        email: req.body.email,
        availability: req.body.availability,
      },
    });

    return res.status(201).json(doctor);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const doctor = await prisma.doctor.update({
      where: { id: req.params.id },
      data: {
        doctorId: req.body.doctorId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        specialization: req.body.specialization,
        department: req.body.department,
        phone: req.body.phone,
        email: req.body.email,
        availability: req.body.availability,
        isActive: req.body.isActive,
      },
    });

    return res.status(200).json(doctor);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.doctor.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Doctor deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
