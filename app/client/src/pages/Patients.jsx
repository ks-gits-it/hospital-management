import React from 'react'
import ApiTable from '../components/ApiTable';
import { patientColumns } from './tableColumns';

const Patients = () => {
  return (
    <ApiTable
      title="Patients"
      endpoint="/api/patients"
      columns={patientColumns}
      idField="id"
    />
  )
}

export default Patients