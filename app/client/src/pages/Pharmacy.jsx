import React from 'react';
import ApiTable from '../components/ApiTable';
import { pharmacyColumns } from './tableColumns';

const Pharmacy = () => {
  return (
    <ApiTable
      title="Pharmacy"
      endpoint="/api/pharmacy"
      columns={pharmacyColumns}
      idField="id"
    />
  );
};

export default Pharmacy;
