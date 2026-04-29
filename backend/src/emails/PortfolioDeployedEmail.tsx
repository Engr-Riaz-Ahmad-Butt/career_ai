import { Button, Text } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface PortfolioDeployedEmailProps {
  name: string;
  portfolioUrl: string;
}

export const PortfolioDeployedEmail = ({ name, portfolioUrl }: PortfolioDeployedEmailProps) => {
  return (
    <BaseEmail heading="Portfolio Deployed!" preview="Your AI-generated portfolio is live">
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        Great news! Your AI-generated portfolio has been successfully deployed and is now live on the web.
      </Text>
      <Text style={defaultText}>
        You can now share this link with recruiters, add it to your resume, or post it on LinkedIn
        to stand out from the crowd.
      </Text>
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={portfolioUrl} style={buttonStyle}>
          View Your Portfolio
        </Button>
      </div>
      <Text style={defaultText}>
        Or copy and paste this URL:
        <br />
        <a href={portfolioUrl} style={{ color: '#4f46e5', wordBreak: 'break-all' }}>
          {portfolioUrl}
        </a>
      </Text>
    </BaseEmail>
  );
};

export default PortfolioDeployedEmail;
