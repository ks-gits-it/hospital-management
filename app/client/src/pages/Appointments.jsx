import ApiTable from '../components/ApiTable';
import { appointmentColumns } from './tableColumns';

const Appointments = () => {
  return (
    <ApiTable
      title="Appointments"
      endpoint="/api/appointments"
      columns={appointmentColumns}
      idField="id"
    />
  );
};

export default Appointments;
