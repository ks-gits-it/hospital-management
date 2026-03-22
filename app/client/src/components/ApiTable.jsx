import { useCallback, useMemo, useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MyTable from './MyTable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const genderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const appointmentStatusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
  { value: 'NO_SHOW', label: 'No Show' },
];

const paymentStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'PARTIAL', label: 'Partial' },
  { value: 'FAILED', label: 'Failed' },
];

function buildAddFormConfig(endpoint, options) {
  const optionalAppointmentRefOptions = [
    { value: '', label: 'None' },
    ...options.appointmentOptions,
  ];

  const optionalStatusOptions = [
    { value: '', label: 'None' },
    ...appointmentStatusOptions,
  ];
  const optionalPaymentStatusOptions = [
    { value: '', label: 'None' },
    ...paymentStatusOptions,
  ];

  const addFormConfigByEndpoint = {
    '/api/patients': [
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      {
        name: 'dateOfBirth',
        label: 'Date of Birth',
        type: 'date',
        required: true,
      },
      {
        name: 'gender',
        label: 'Gender',
        required: true,
        options: genderOptions,
      },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'email', label: 'Email' },
    ],
    '/api/doctors': [
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      { name: 'specialization', label: 'Specialization', required: true },
      { name: 'department', label: 'Department', required: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'email', label: 'Email' },
    ],
    '/api/appointments': [
      {
        name: 'patientRefId',
        label: 'Patient',
        required: true,
        options: options.patientOptions,
      },
      {
        name: 'doctorRefId',
        label: 'Doctor',
        required: true,
        options: options.doctorOptions,
      },
      {
        name: 'appointmentAt',
        label: 'Appointment At',
        type: 'datetime-local',
        required: true,
      },
      {
        name: 'status',
        label: 'Status',
        options: optionalStatusOptions,
      },
      { name: 'reason', label: 'Reason' },
    ],
    '/api/pharmacy': [
      { name: 'name', label: 'Medicine Name', required: true },
      { name: 'category', label: 'Category' },
      { name: 'stock', label: 'Stock', type: 'number', required: true },
      { name: 'minStock', label: 'Min Stock', type: 'number' },
      {
        name: 'unitPrice',
        label: 'Unit Price',
        type: 'number',
        required: true,
      },
      { name: 'expiryDate', label: 'Expiry Date', type: 'date' },
    ],
    '/api/billing': [
      {
        name: 'patientRefId',
        label: 'Patient',
        required: true,
        options: options.patientOptions,
      },
      {
        name: 'appointmentRefId',
        label: 'Appointment',
        options: optionalAppointmentRefOptions,
      },
      { name: 'consultationFee', label: 'Consultation Fee', type: 'number' },
      { name: 'medicineCharges', label: 'Medicine Charges', type: 'number' },
      { name: 'labCharges', label: 'Lab Charges', type: 'number' },
      { name: 'serviceCharges', label: 'Service Charges', type: 'number' },
      {
        name: 'paymentStatus',
        label: 'Payment Status',
        options: optionalPaymentStatusOptions,
      },
    ],
    '/api/staff': [
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      { name: 'role', label: 'Role', required: true },
      { name: 'department', label: 'Department', required: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'email', label: 'Email' },
    ],
  };

  return addFormConfigByEndpoint[endpoint] || [];
}

async function fetchLookupOptions(endpoint, mapper) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    return [];
  }

  const data = await response.json();
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map(mapper)
    .filter((option) => option && option.value && option.label);
}

function normalizeCreatePayload(formData, addFields) {
  return addFields.reduce((payload, field) => {
    const rawValue = formData[field.name];

    if (
      rawValue === undefined ||
      rawValue === null ||
      String(rawValue).trim() === ''
    ) {
      return payload;
    }

    if (field.type === 'number') {
      payload[field.name] = Number(rawValue);
      return payload;
    }

    payload[field.name] = rawValue;
    return payload;
  }, {});
}

function normalizeUpdatePayload(formData, addFields) {
  return normalizeCreatePayload(formData, addFields);
}

function getRecordId(record, idField) {
  return record && record[idField] !== undefined && record[idField] !== null
    ? record[idField]
    : null;
}

function mergeUpdatedRows(prevRows, updatedRows, idField) {
  const updates = Array.isArray(updatedRows) ? updatedRows : [updatedRows];

  return prevRows.map((row) => {
    const matchedUpdate = updates.find(
      (item) => getRecordId(item, idField) === getRecordId(row, idField),
    );

    return matchedUpdate ? { ...row, ...matchedUpdate } : row;
  });
}

function removeDeletedRows(prevRows, deletedRows, idField) {
  const deletions = Array.isArray(deletedRows) ? deletedRows : [deletedRows];
  const deletedIds = new Set(
    deletions.map((item) =>
      typeof item === 'object' ? getRecordId(item, idField) : item,
    ),
  );

  return prevRows.filter((row) => !deletedIds.has(getRecordId(row, idField)));
}

export default function ApiTable({ title, endpoint, columns, idField = 'id' }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lookupOptions, setLookupOptions] = useState({
    patientOptions: [],
    doctorOptions: [],
    appointmentOptions: [],
  });

  const addFields = useMemo(
    () => buildAddFormConfig(endpoint, lookupOptions),
    [endpoint, lookupOptions],
  );

  const refreshRows = useCallback(
    async (signal) => {
      setLoading(true);
      setError('');

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch ${title.toLowerCase()}`);
      }

      const data = await response.json();
      setRows(Array.isArray(data) ? data : []);
    },
    [endpoint, title],
  );

  useEffect(() => {
    const controller = new AbortController();

    async function hydrateRows() {
      try {
        await refreshRows(controller.signal);
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(
            fetchError.message || 'Something went wrong while loading data.',
          );
        }
      } finally {
        setLoading(false);
      }
    }

    hydrateRows();

    return () => {
      controller.abort();
    };
  }, [refreshRows]);

  useEffect(() => {
    let isActive = true;

    async function loadLookupData() {
      const [patientOptions, doctorOptions, appointmentOptions] =
        await Promise.all([
          fetchLookupOptions('/api/patients', (patient) => ({
            value: patient.id,
            label: `${patient.patientId} - ${patient.firstName} ${patient.lastName}`,
          })),
          fetchLookupOptions('/api/doctors', (doctor) => ({
            value: doctor.id,
            label: `${doctor.doctorId} - ${doctor.firstName} ${doctor.lastName}`,
          })),
          fetchLookupOptions('/api/appointments', (appointment) => ({
            value: appointment.id,
            label: `${appointment.appointmentId} - ${new Date(appointment.appointmentAt).toLocaleString()}`,
          })),
        ]);

      if (!isActive) {
        return;
      }

      setLookupOptions({
        patientOptions,
        doctorOptions,
        appointmentOptions,
      });
    }

    loadLookupData();

    return () => {
      isActive = false;
    };
  }, []);

  const handleAddRecord = useCallback(
    async (formData) => {
      const payload = normalizeCreatePayload(formData, addFields);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to add ${title.toLowerCase()}.`,
        );
      }

      await refreshRows();
    },
    [addFields, endpoint, refreshRows, title],
  );

  const handleUpdateRecord = useCallback(
    async (updateRequest) => {
      const requests = Array.isArray(updateRequest)
        ? updateRequest
        : [updateRequest];

      const updatedRows = await Promise.all(
        requests.map(async ({ row, values }) => {
          const recordId = getRecordId(row, idField);

          const response = await fetch(
            `${API_BASE_URL}${endpoint}/${recordId}`,
            {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(normalizeUpdatePayload(values, addFields)),
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `Failed to update ${title.toLowerCase()}.`,
            );
          }

          return response.json();
        }),
      );

      setRows((prevRows) => mergeUpdatedRows(prevRows, updatedRows, idField));
    },
    [addFields, endpoint, idField, title],
  );

  const handleDeleteRecord = useCallback(
    async (deletedRows) => {
      const removals = Array.isArray(deletedRows) ? deletedRows : [deletedRows];

      await Promise.all(
        removals.map(async (row) => {
          const recordId = getRecordId(row, idField);
          const response = await fetch(
            `${API_BASE_URL}${endpoint}/${recordId}`,
            {
              method: 'DELETE',
            },
          );

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
              errorData.message || `Failed to delete ${title.toLowerCase()}.`,
            );
          }
        }),
      );

      setRows((prevRows) => removeDeletedRows(prevRows, removals, idField));
    },
    [endpoint, idField, title],
  );

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ width: '100%', py: 6 }}>
        <CircularProgress />
        <Typography variant="body1">
          Loading {title.toLowerCase()}...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ width: '100%' }}>
        {error}
      </Alert>
    );
  }

  return (
    <MyTable
      title={title}
      rows={rows}
      columns={columns}
      idField={idField}
      addFields={addFields}
      onAddRecord={handleAddRecord}
      onUpdateRecord={handleUpdateRecord}
      onDeleteRecord={handleDeleteRecord}
    />
  );
}
