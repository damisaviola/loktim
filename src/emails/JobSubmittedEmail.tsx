import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from '@react-email/components';
import * as React from 'react';

interface JobSubmittedEmailProps {
  jobTitle: string;
  companyName: string;
  manageLink: string;
}

export default function JobSubmittedEmail({ jobTitle, companyName, manageLink }: JobSubmittedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Lowongan Anda sedang kami review</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Lowongan Berhasil Dikirim</Heading>
          <Text style={text}>
            Halo,
          </Text>
          <Text style={text}>
            Terima kasih telah memposting lowongan <strong>{jobTitle}</strong> di <strong>{companyName}</strong> melalui platform kami.
          </Text>
          <Text style={text}>
            Saat ini lowongan Anda sedang dalam tahap <strong>review</strong> oleh tim admin kami (maksimal 1x24 jam). Kami akan mengabari Anda jika lowongan telah tayang.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={manageLink}>
              Pantau Status Lowongan
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  padding: '0 48px',
};

const text = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 48px',
};

const btnContainer = {
  padding: '0 48px',
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '14px 7px',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  padding: '0 48px',
};
