import { Button, Text, Section } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface WelcomeEmailProps {
  name: string;
  dashboardLink: string;
}

export const WelcomeEmail = ({ name, dashboardLink }: WelcomeEmailProps) => {
  return (
    <BaseEmail
      heading={`Welcome to CareerForge AI, ${name}! 🚀`}
      preview="Your 10 free credits are ready — let's build your career"
    >
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        You're in! CareerForge AI gives you AI-powered tools to build ATS-friendly resumes,
        generate cover letters, prep for interviews, and deploy a personal portfolio — all in one place.
      </Text>

      <Section style={{ backgroundColor: '#f0f9ff', borderRadius: '8px', padding: '16px 20px', marginBottom: '24px' }}>
        <Text style={{ ...defaultText, margin: 0, fontWeight: '600', color: '#0369a1' }}>
          🎁 You have 10 free credits ready to use
        </Text>
        <Text style={{ ...defaultText, margin: '8px 0 0 0', fontSize: '14px', color: '#0c4a6e' }}>
          Each AI action (tailoring, generating, analyzing) costs 1–5 credits.
        </Text>
      </Section>

      <Text style={{ ...defaultText, fontWeight: '600' }}>Get started in 3 steps:</Text>
      <Text style={{ ...defaultText, marginBottom: '8px' }}>1. Upload or build your resume</Text>
      <Text style={{ ...defaultText, marginBottom: '8px' }}>2. Run an ATS scan against a job description</Text>
      <Text style={{ ...defaultText, marginBottom: '24px' }}>3. Generate a tailored cover letter</Text>

      <Button href={dashboardLink} style={buttonStyle}>
        Go to Dashboard →
      </Button>
    </BaseEmail>
  );
};

export default WelcomeEmail;
