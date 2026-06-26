import { Html, Head, Preview, Body, Container, Section, Text, Button, Heading, Hr } from '@react-email/components';
import * as React from 'react';

interface JobApprovedEmailProps {
  jobTitle: string;
  companyName: string;
  publicLink: string;
}

export default function JobApprovedEmail({ jobTitle, companyName, publicLink }: JobApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Kabar gembira! Lowongan Anda telah tayang</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Lowongan Disetujui! 🎉</Heading>
          <Text style={text}>
            Halo,
          </Text>
          <Text style={text}>
            Selamat! Lowongan <strong>{jobTitle}</strong> di <strong>{companyName}</strong> telah disetujui oleh tim kami dan sekarang sudah tayang di platform LokTim.
          </Text>
          <Text style={text}>
            Kandidat terbaik kini dapat melihat lowongan Anda dan melamar.
          </Text>
          <Section style={btnContainer}>
            <Button style={button} href={publicLink}>
              Lihat Lowongan
            </Button>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Sukses untuk pencarian kandidat Anda! Jika Anda memiliki pertanyaan, silakan hubungi tim dukungan kami.
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
  backgroundColor: '#10b981', // Emerald green for success
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
