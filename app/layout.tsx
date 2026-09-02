import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ZX 360º',
  description: 'Plataforma Completa de Manutenção Predial 4.0, PWA Offline-First, Geolocalização GPS, Centro de Controle HUD, Gêmeo Digital, Telemetria IoT e Gestão Normativa PMOC/AVCB/NRs.',
  openGraph: {
    title: 'ZX 360º',
    description: 'Plataforma Completa de Manutenção Predial 4.0, PWA Offline-First, Geolocalização GPS, Centro de Controle HUD, Gêmeo Digital, Telemetria IoT e Gestão Normativa PMOC/AVCB/NRs.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ZX 360º',
    description: 'Plataforma Completa de Manutenção Predial 4.0, PWA Offline-First, Geolocalização GPS, Centro de Controle HUD, Gêmeo Digital, Telemetria IoT e Gestão Normativa PMOC/AVCB/NRs.',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#09090b',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body suppressHydrationWarning className="bg-[#09090B] text-zinc-100 min-h-screen antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}

