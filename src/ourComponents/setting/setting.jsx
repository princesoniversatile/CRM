import React from 'react';

import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { UpdatePasswordForm } from './update-password';

function Setting  () {
  return (
    <Card>
      <CardHeader title="Account Settings" />
      <Divider />
      <CardContent>
        <Typography variant="body1" gutterBottom>
          Manage your account settings here.
        </Typography>
        <div>
          <UpdatePasswordForm />
          <Typography variant="body2" color="textSecondary">
            Note: For security reasons, we recommend changing your password regularly.
          </Typography>
        </div>
      </CardContent>
    </Card>
  );
};

export default Setting;
