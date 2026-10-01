import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/home/Hero';
import { TrustCredentials } from './components/home/TrustCredentials';
import { ServicesGrid } from './components/home/ServicesGrid';
import { IndustriesSection } from './components/home/IndustriesSection';
import { VerifiedFacts } from './components/home/VerifiedFacts';
import { CoverageMap } from './components/home/CoverageMap';
import { AboutCompany } from './components/home/AboutCompany';
import { VerificationPortal } from './components/verification/VerificationPortal';
import { QuotationCalculator } from './components/quotation/QuotationCalculator';
import { RecruitmentPortal } from './components/recruitment/RecruitmentPortal';
import { ClientPortal } from './components/portal/ClientPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { SecurityServicesPage } from './components/services/SecurityServicesPage';
import { CoveragePage } from './components/coverage/CoveragePage';
import { ContactPage } from './components/contact/ContactPage';
import { TrustMediaCenterHub } from './components/trust/TrustMediaCenterHub';
import { SecurityAiAssistant } from './components/ai/SecurityAiAssistant';
import { SeoSchemaMarkup } from './components/trust/SeoSchemaMarkup';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <LanguageProvider>
      <AuthProvider>
        <SeoSchemaMarkup />
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col selection:bg-blue-900 selection:text-white">
          {/* Header Bar */}
          <Header activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Main View Router */}
          <main className="flex-1">
            {activeTab === 'home' && (
              <>
                <Hero setActiveTab={setActiveTab} />
                <TrustCredentials setActiveTab={setActiveTab} />
                <ServicesGrid setActiveTab={setActiveTab} />
                <IndustriesSection setActiveTab={setActiveTab} />
                <VerifiedFacts />
                <CoverageMap setActiveTab={setActiveTab} />
              </>
            )}

            {activeTab === 'about' && (
              <AboutCompany setActiveTab={setActiveTab} />
            )}

            {activeTab === 'services' && (
              <SecurityServicesPage setActiveTab={setActiveTab} onOpenEmergency={() => setActiveTab('quotation')} />
            )}

            {activeTab === 'industries' && (
              <IndustriesSection setActiveTab={setActiveTab} />
            )}

            {activeTab === 'coverage' && (
              <CoveragePage setActiveTab={setActiveTab} />
            )}

            {activeTab === 'contact' && (
              <ContactPage setActiveTab={setActiveTab} />
            )}

            {activeTab === 'gallery' && (
              <TrustMediaCenterHub onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'news' && (
              <TrustMediaCenterHub onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'trust' && (
              <TrustMediaCenterHub onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'knowledge' && (
              <TrustMediaCenterHub onNavigateTab={setActiveTab} />
            )}

            {activeTab === 'verify' && (
              <VerificationPortal />
            )}

            {activeTab === 'quotation' && (
              <QuotationCalculator />
            )}

            {activeTab === 'recruitment' && (
              <RecruitmentPortal />
            )}

            {activeTab === 'portal' && (
              <ClientPortal />
            )}

            {activeTab === 'admin' && (
              <AdminDashboard />
            )}
          </main>

          {/* Footer */}
          <Footer setActiveTab={setActiveTab} />

          {/* AI Security Consultant Floating Assistant */}
          <SecurityAiAssistant />
        </div>
      </AuthProvider>
    </LanguageProvider>
  );
}
