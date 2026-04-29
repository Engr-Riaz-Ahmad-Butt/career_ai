import { Button, Text, Section, Row, Column } from '@react-email/components';
import * as React from 'react';

import { BaseEmail, defaultText, buttonStyle } from './BaseEmail';

interface PaymentSuccessEmailProps {
  name: string;
  amount: number;
  creditsAdded: number;
  newBalance: number;
  receiptUrl: string;
}

export const PaymentSuccessEmail = ({
  name,
  amount,
  creditsAdded,
  newBalance,
  receiptUrl,
}: PaymentSuccessEmailProps) => {
  return (
    <BaseEmail heading="Payment Successful" preview="Your credits have been added">
      <Text style={defaultText}>Hi {name},</Text>
      <Text style={defaultText}>
        Thank you for your purchase! We've successfully processed your payment of{' '}
        <strong>${(amount / 100).toFixed(2)}</strong>.
      </Text>

      <Section style={receiptBox}>
        <Row style={receiptRow}>
          <Column style={receiptLabel}>Credits Added:</Column>
          <Column style={receiptValue}>+{creditsAdded}</Column>
        </Row>
        <Row style={receiptRow}>
          <Column style={receiptLabel}>New Balance:</Column>
          <Column style={receiptValue}>{newBalance}</Column>
        </Row>
      </Section>

      <Text style={defaultText}>
        Your credits are ready to use immediately. Jump back in and continue supercharging your
        career.
      </Text>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <Button href={receiptUrl} style={buttonStyle}>
          View Receipt
        </Button>
      </div>
    </BaseEmail>
  );
};

// ── Styles ──────────────────────────────────────────────────────────────────

const receiptBox = {
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 0',
};

const receiptRow = {
  marginBottom: '12px',
};

const receiptLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  width: '50%',
};

const receiptValue = {
  color: '#0f172a',
  fontSize: '16px',
  fontWeight: '700',
  width: '50%',
  textAlign: 'right' as const,
};

export default PaymentSuccessEmail;
