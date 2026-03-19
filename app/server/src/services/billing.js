const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const bills = await prisma.bill.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(bills);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { patientRefId } = req.body;

    if (!patientRefId) {
      return res.status(400).json({ message: 'patientRefId is required.' });
    }

    const consultationFee = Number(req.body.consultationFee ?? 0);
    const medicineCharges = Number(req.body.medicineCharges ?? 0);
    const labCharges = Number(req.body.labCharges ?? 0);
    const serviceCharges = Number(req.body.serviceCharges ?? 0);
    const totalAmount = Number(
      req.body.totalAmount ??
        consultationFee + medicineCharges + labCharges + serviceCharges,
    );

    const bill = await prisma.bill.create({
      data: {
        billId: req.body.billId || randomId('BILL'),
        patientRefId,
        appointmentRefId: req.body.appointmentRefId,
        consultationFee,
        medicineCharges,
        labCharges,
        serviceCharges,
        totalAmount,
        paymentStatus: req.body.paymentStatus,
        paidAt: req.body.paidAt ? new Date(req.body.paidAt) : undefined,
      },
    });

    return res.status(201).json(bill);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.bill.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Bill deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
