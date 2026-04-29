import { Button, Text } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface VerificationEmailProps {
  name: string;
  verificationLink: string;
}

export const VerificationEmail = ({ name, verificationLink }: VerificationEmailProps) => {
  return (
    <BaseEmail heading="Welcome to CareerForge AI!" preview="Verify your email address">
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        Thanks for signing up for CareerForge AI. We're excited to help you build your career and
        land your dream job.
      </Text>
      <Text style={defaultText}>
        Before you can start using all of our AI-powered features, please verify your email address
        by clicking the button below:
      </Text>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={verificationLink} style={buttonStyle}>
          Verify Email Address
        </Button>
      </div>
      <Text style={defaultText}>
        Or copy and paste this URL into your browser:
        <br />
        <a href={verificationLink} style={{ color: '#4f46e5', wordBreak: 'break-all' }}>
          {verificationLink}
        </a>
      </Text>
      <Text style={defaultText}>
        If you didn't create an account, you can safely ignore this email.
      </Text>
    </BaseEmail>
  );
};

export default VerificationEmail;
