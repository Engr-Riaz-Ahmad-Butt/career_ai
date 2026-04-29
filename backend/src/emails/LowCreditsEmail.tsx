import { Button, Text } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface LowCreditsEmailProps {
  name: string;
  creditsRemaining: number;
  topUpLink: string;
}

export const LowCreditsEmail = ({ name, creditsRemaining, topUpLink }: LowCreditsEmailProps) => {
  return (
    <BaseEmail heading="Low Credits Alert" preview={`You have ${creditsRemaining} credits left`}>
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        You're running low on CareerForge AI credits! You currently have{' '}
        <strong>{creditsRemaining}</strong> credits remaining in your account.
      </Text>
      <Text style={defaultText}>
        Don't let your job search lose momentum. Top up your credits now to continue using our
        AI-powered tools to generate cover letters, optimize your resume, and prepare for interviews.
      </Text>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={topUpLink} style={buttonStyle}>
          Top Up Credits
        </Button>
      </div>
      <Text style={defaultText}>
        Thanks for using CareerForge AI!
      </Text>
    </BaseEmail>
  );
};

export default LowCreditsEmail;
