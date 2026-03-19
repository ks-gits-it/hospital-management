const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientRefId, doctorRefId, appointmentAt } = req.body;

    if (!patientRefId || !doctorRefId || !appointmentAt) {
      return res.status(400).json({
        message: 'patientRefId, doctorRefId, and appointmentAt are required.',
      });
    }

    const appointment = await prisma.appointment.create({
      data: {
        appointmentId: req.body.appointmentId || randomId('APT'),
        patientRefId,
        doctorRefId,
        appointmentAt: new Date(appointmentAt),
        reason: req.body.reason,
        status: req.body.status,
        notes: req.body.notes,
      },
    });

    return res.status(201).json(appointment);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.appointment.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
