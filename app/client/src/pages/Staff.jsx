import React from 'react';
import ApiTable from '../components/ApiTable';
import { staffColumns } from './tableColumns';

const Staff = () => {
  return (
    <ApiTable
      title="Staff"
      endpoint="/api/staff"
      columns={staffColumns}
      idField="id"
    />
  );
};

export default Staff;
