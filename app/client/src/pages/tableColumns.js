export const patientColumns = [
  { id: 'patientId', label: 'Patient ID', numeric: false, disablePadding: true },
  { id: 'firstName', label: 'First Name', numeric: false },
  { id: 'lastName', label: 'Last Name', numeric: false },
  { id: 'phone', label: 'Phone', numeric: false },
  {
    id: 'gender',
    label: 'Gender',
    numeric: false,
    format: (value) => (value ? String(value) : '-'),
  },
  {
    id: 'createdAt',
    label: 'Created At',
    numeric: false,
    format: (value) => (value ? new Date(value).toLocaleString() : '-'),
  },
];

export const doctorColumns = [
  { id: 'doctorId', label: 'Doctor ID', numeric: false, disablePadding: true },
  { id: 'firstName', label: 'First Name', numeric: false },
  { id: 'lastName', label: 'Last Name', numeric: false },
  { id: 'specialization', label: 'Specialization', numeric: false },
  { id: 'department', label: 'Department', numeric: false },
  { id: 'phone', label: 'Phone', numeric: false },
];

export const appointmentColumns = [
  {
    id: 'appointmentId',
    label: 'Appointment ID',
    numeric: false,
    disablePadding: true,
  },
  { id: 'patientRefId', label: 'Patient Ref', numeric: false },
  { id: 'doctorRefId', label: 'Doctor Ref', numeric: false },
  {
    id: 'appointmentAt',
    label: 'Appointment At',
    numeric: false,
    format: (value) => (value ? new Date(value).toLocaleString() : '-'),
  },
  { id: 'status', label: 'Status', numeric: false },
];

export const pharmacyColumns = [
  { id: 'itemId', label: 'Item ID', numeric: false, disablePadding: true },
  { id: 'name', label: 'Medicine', numeric: false },
  { id: 'category', label: 'Category', numeric: false },
  { id: 'stock', label: 'Stock', numeric: true },
  { id: 'minStock', label: 'Min Stock', numeric: true },
  { id: 'unitPrice', label: 'Unit Price', numeric: true },
];

export const billingColumns = [
  { id: 'billId', label: 'Bill ID', numeric: false, disablePadding: true },
  { id: 'patientRefId', label: 'Patient Ref', numeric: false },
  { id: 'totalAmount', label: 'Total Amount', numeric: true },
  { id: 'paymentStatus', label: 'Payment Status', numeric: false },
  {
    id: 'paidAt',
    label: 'Paid At',
    numeric: false,
    format: (value) => (value ? new Date(value).toLocaleString() : '-'),
  },
];

export const staffColumns = [
  { id: 'staffId', label: 'Staff ID', numeric: false, disablePadding: true },
  { id: 'firstName', label: 'First Name', numeric: false },
  { id: 'lastName', label: 'Last Name', numeric: false },
  { id: 'role', label: 'Role', numeric: false },
  { id: 'department', label: 'Department', numeric: false },
  { id: 'phone', label: 'Phone', numeric: false },
];
