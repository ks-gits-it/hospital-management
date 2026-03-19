import React from 'react';
import ApiTable from '../components/ApiTable';
import { doctorColumns } from './tableColumns';

const Doctors = () => {
  return (
    <ApiTable
      title="Doctors"
      endpoint="/api/doctors"
      columns={doctorColumns}
      idField="id"
    />
  );
};

export default Doctors;
