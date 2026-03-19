import React from 'react';
import ApiTable from '../components/ApiTable';
import { billingColumns } from './tableColumns';

const Billing = () => {
  return (
    <ApiTable
      title="Billing"
      endpoint="/api/billing"
      columns={billingColumns}
      idField="id"
    />
  );
};

export default Billing;
