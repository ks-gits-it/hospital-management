const express = require('express');
const prisma = require('../prisma/client.js');
const { randomId } = require('../utils/id');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await prisma.pharmacyItem.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, stock, unitPrice } = req.body;

    if (!name || stock === undefined || unitPrice === undefined) {
      return res.status(400).json({
        message: 'name, stock, and unitPrice are required.',
      });
    }

    const item = await prisma.pharmacyItem.create({
      data: {
        itemId: req.body.itemId || randomId('MED'),
        name,
        category: req.body.category,
        stock: Number(stock),
        minStock: Number(req.body.minStock ?? 0),
        expiryDate: req.body.expiryDate ? new Date(req.body.expiryDate) : undefined,
        unitPrice: Number(unitPrice),
      },
    });

    return res.status(201).json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const item = await prisma.pharmacyItem.update({
      where: { id: req.params.id },
      data: {
        itemId: req.body.itemId,
        name: req.body.name,
        category: req.body.category,
        stock:
          req.body.stock !== undefined ? Number(req.body.stock) : undefined,
        minStock:
          req.body.minStock !== undefined
            ? Number(req.body.minStock)
            : undefined,
        expiryDate: req.body.expiryDate
          ? new Date(req.body.expiryDate)
          : undefined,
        unitPrice:
          req.body.unitPrice !== undefined
            ? Number(req.body.unitPrice)
            : undefined,
        isActive: req.body.isActive,
      },
    });

    return res.status(200).json(item);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await prisma.pharmacyItem.delete({ where: { id: req.params.id } });
    return res.status(200).json({ message: 'Pharmacy item deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

module.exports = router;
