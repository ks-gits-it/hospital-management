const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const staffRecords = await prisma.staff.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(staffRecords);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, role, department, phone } = req.body;

    if (!firstName || !lastName || !role || !department || !phone) {
      return res.status(400).json({
        message:
          'firstName, lastName, role, department, and phone are required.',
      });
    }

    const staff = await prisma.staff.create({
      data: {
        staffId: req.body.staffId || randomId('STF'),
        firstName,
        lastName,
        role,
        department,
        phone,
        email: req.body.email,
      },
    });

    return res.status(201).json(staff);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const staff = await prisma.staff.update({
      where: { id: req.params.id },
      data: {
        staffId: req.body.staffId,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: req.body.role,
        department: req.body.department,
        phone: req.body.phone,
        email: req.body.email,
        isActive: req.body.isActive,
      },
    });

    return res.status(200).json(staff);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.staff.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Staff deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
