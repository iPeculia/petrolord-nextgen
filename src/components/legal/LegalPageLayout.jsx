import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Printer, Menu, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import Footer from '@/components/Footer';

const LegalPageLayout = ({ title, lastUpdated, children, tocItems = [] }) => {
  const [activeSection, setActiveSection] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Handle scroll spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const sections = tocItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(tocItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
      setMobileMenuOpen(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-[#BFFF00] selection:text-black flex flex-col">
      <Helmet>
        <title>{title} | Petrolord NextGen</title>
      </Helmet>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-md border-b border-slate-800 h-16 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="h-6 w-px bg-slate-700 hidden sm:block"></div>
            <h1 className="text-lg font-semibold text-white truncate">{title}</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={handlePrint} className="text-slate-400 hover:text-[#BFFF00] hidden sm:flex" title="Print Policy">
              <Printer className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-slate-400">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 max-w-7xl mx-auto w-full pt-24 pb-16 px-4 sm:px-6 lg:px-8 flex gap-12 relative">
        
        {/* Desktop Sidebar TOC */}
        <aside className="hidden lg:block w-64 sticky top-24 h-[calc(100vh-8rem)] shrink-0 print:hidden">
          <div className="h-full flex flex-col">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Table of Contents</h3>
            <ScrollArea className="flex-1 pr-4">
              <nav className="space-y-1">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-2 text-sm rounded-md transition-colors border-l-2",
                      activeSection === item.id
                        ? "bg-[#BFFF00]/10 text-[#BFFF00] border-[#BFFF00] font-medium"
                        : "text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            </ScrollArea>
          </div>
        </aside>

        {/* Mobile Sidebar (Drawer) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden print:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
            <div className="absolute right-0 top-16 bottom-0 w-3/4 max-w-xs bg-[#1E293B] border-l border-slate-700 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Jump to Section</h3>
              <nav className="space-y-2">
                {tocItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "w-full text-left px-3 py-3 text-sm rounded-md flex items-center justify-between",
                      activeSection === item.id
                        ? "bg-[#BFFF00]/10 text-[#BFFF00] font-medium"
                        : "text-slate-300 hover:bg-slate-800"
                    )}
                  >
                    {item.label}
                    {activeSection === item.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 print:w-full print:pt-0">
          <div className="mb-8 border-b border-slate-800 pb-8 print:border-black">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight print:text-black">{title}</h1>
            <div className="flex items-center gap-2 text-slate-400 text-sm print:text-gray-600">
              <span>Last Updated:</span>
              <span className="text-[#BFFF00] font-mono print:text-black">{lastUpdated}</span>
            </div>
          </div>

          <div className="prose prose-invert prose-slate max-w-none prose-headings:scroll-mt-28 prose-a:text-[#BFFF00] hover:prose-a:text-[#a3d900] print:prose-black">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;