import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from '@react-email/components';
import * as React from 'react';

interface JobReportedEmailProps {
  jobTitle: string;
  reportReason: string;
  reportDetails?: string;
  adminLink: string;
}

export default function JobReportedEmail({ jobTitle, reportReason, reportDetails, adminLink }: JobReportedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>🚨 Laporan Baru: {jobTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Laporan Lowongan Baru</Heading>
          <Text style={text}>
            Halo Admin,
          </Text>
          <Text style={text}>
            Seorang pengguna baru saja melaporkan lowongan <strong>{jobTitle}</strong>.
          </Text>
          <Section style={detailsContainer}>
            <Text style={text}><strong>Alasan:</strong> {reportReason}</Text>
            {reportDetails && <Text style={text}><strong>Detail Tambahan:</strong> {reportDetails}</Text>}
          </Section>
          <Text style={text}>
            Harap segera meninjau laporan ini di dashboard admin.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={adminLink}>
              Tinjau Laporan
            </Button>
          </Section>
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

const detailsContainer = {
  backgroundColor: '#f9fafb',
  padding: '16px 48px',
  margin: '16px 0',
  borderLeft: '4px solid #ef4444',
};

const btnContainer = {
  padding: '0 48px',
  marginTop: '24px',
  marginBottom: '24px',
};

const button = {
  backgroundColor: '#ef4444',
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
