import React from 'react';
import { Link } from 'react-router';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

const Home = () => {
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Typography variant="h4">Hospital Management</Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
        <Link to="/patients">Patients</Link>
        <Link to="/doctors">Doctors</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/pharmacy">Pharmacy</Link>
        <Link to="/billing">Billing</Link>
        <Link to="/staff">Staff</Link>
      </Stack>
    </Stack>
  );
};

export default Home;