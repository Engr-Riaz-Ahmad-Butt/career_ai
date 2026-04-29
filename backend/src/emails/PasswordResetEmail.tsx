import { Button, Text } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface PasswordResetEmailProps {
  name: string;
  resetLink: string;
}

export const PasswordResetEmail = ({ name, resetLink }: PasswordResetEmailProps) => {
  return (
    <BaseEmail heading="Reset Your Password" preview="Password reset instructions">
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        We received a request to reset the password for your CareerForge AI account.
      </Text>
      <Text style={defaultText}>
        Click the button below to choose a new password:
      </Text>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={resetLink} style={buttonStyle}>
          Reset Password
        </Button>
      </div>
      <Text style={defaultText}>
        Or copy and paste this URL into your browser:
        <br />
        <a href={resetLink} style={{ color: '#4f46e5', wordBreak: 'break-all' }}>
          {resetLink}
        </a>
      </Text>
      <Text style={defaultText}>
        If you didn't request a password reset, you can safely ignore this email. Your password
        will remain unchanged.
      </Text>
    </BaseEmail>
  );
};

export default PasswordResetEmail;
