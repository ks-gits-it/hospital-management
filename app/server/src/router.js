const express = require('express');
const patientsRouter = require('./services/patients');
const doctorsRouter = require('./services/doctors');
const appointmentsRouter = require('./services/appointments');
const pharmacyRouter = require('./services/pharmacy');
const billingRouter = require('./services/billing');
const staffRouter = require('./services/staff');

const router = express.Router();

router.use('/patients', patientsRouter);
router.use('/doctors', doctorsRouter);
router.use('/appointments', appointmentsRouter);
router.use('/pharmacy', pharmacyRouter);
router.use('/billing', billingRouter);
router.use('/staff', staffRouter);

module.exports = router;
