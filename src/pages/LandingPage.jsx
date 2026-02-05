import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Mail, Linkedin, Twitter, Facebook, Instagram, MapPin, Menu, X, School, Users, GraduationCap, Unlock, Clock, ShieldAlert, BookOpen, Laptop } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Footer from '@/components/Footer'; // Import the new Footer component

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);
  const fadeIn = {
    hidden: {
      opacity: 0,
      y: 20
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };
  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 font-sans flex flex-col selection:bg-[#BFFF00] selection:text-black">
      {/* Navbar */}
      <nav className="border-b border-slate-800 bg-[#020617]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 flex items-center justify-center overflow-hidden rounded-lg shadow-lg shadow-[#BFFF00]/20 group-hover:shadow-[#BFFF00]/40 transition-all duration-300">
                 <img alt="Company Logo Icon" className="w-full h-full object-cover" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/petrolord-symbol-512-4kVUt.png" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Petrolord <span className="text-[#BFFF00]">NextGen</span></span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">About</a>
              <a href="#process" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">How It Works</a>
              <a href="#requirements" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">Requirements</a>
              <a href="#benefits" className="text-sm font-medium text-slate-300 hover:text-[#BFFF00] transition-colors">Benefits</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">Log In</Button>
              </Link>
              <Link to="/university-onboarding">
                <Button className="bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold border-none shadow-[0_0_15px_rgba(191,255,0,0.3)] hover:shadow-[0_0_25px_rgba(191,255,0,0.5)] transition-all">University Onboarding</Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={toggleMobileMenu} className="text-slate-300 hover:text-white p-2">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1E293B] border-b border-slate-800 py-4 px-4 space-y-4 shadow-xl">
            <a href="#about" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">About</a>
            <a href="#process" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">How It Works</a>
            <a href="#requirements" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">Requirements</a>
            <a href="#benefits" onClick={toggleMobileMenu} className="block text-base font-medium text-slate-300 hover:text-[#BFFF00]">Benefits</a>
            <div className="pt-4 border-t border-slate-700 flex flex-col gap-3">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full justify-center border-slate-600 text-slate-200">Log In</Button>
              </Link>
              <Link to="/university-onboarding" className="w-full">
                <Button className="w-full justify-center bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold">University Onboarding</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-[#BFFF00]/10 via-[#BFFF00]/5 to-transparent opacity-20 blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 mb-8 backdrop-blur-md shadow-lg">
              <span className="flex h-2.5 w-2.5 rounded-full bg-[#BFFF00] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#BFFF00] uppercase tracking-wider">For Academic Institutions</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-tight">
              Bridging the Gap Between <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BFFF00] to-emerald-400">Education & Industry</span>
            </h1>
            
            <p className="mt-8 max-w-2xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
              Empower your students with <strong>Petrolord NextGen</strong>—the industry-standard energy operating system designed specifically for university curricula and research.
            </p>
            
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/university-onboarding" className="w-full sm:w-auto">
                <Button size="lg" className="h-14 px-10 bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold text-lg w-full shadow-[0_0_20px_rgba(191,255,0,0.4)] hover:shadow-[0_0_30px_rgba(191,255,0,0.6)] transition-all">
                  Start University Onboarding
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <a href="#process" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="h-14 px-10 border-slate-600 text-slate-200 hover:bg-slate-800 hover:text-white font-semibold text-lg w-full">
                  Learn How It Works
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Is Petrolord NextGen */}
      <section id="about" className="py-20 bg-[#0F172A] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                What is Petrolord <span className="text-[#BFFF00]">NextGen</span>?
              </h2>
              <div className="space-y-4 text-slate-300 text-lg leading-relaxed">
                <p>
                  Petrolord NextGen is the dedicated academic edition of the Petrolord Suite, offering students and faculty access to the same advanced tools used by major energy companies worldwide.
                </p>
                <p>
                  It moves beyond traditional textbooks, offering a hands-on digital environment where students simulate real-world scenarios, analyze reservoir data, and manage drilling operations—all within a safe, cloud-based platform.
                </p>
                <ul className="grid grid-cols-1 gap-3 mt-6">
                  {['Industry-standard algorithms', 'Real-world datasets included', 'Cloud-based collaboration', 'Zero installation required'].map((item, i) => <li key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#BFFF00] shrink-0" />
                      <span className="text-slate-200">{item}</span>
                    </li>)}
                </ul>
              </div>
            </motion.div>
            <motion.div initial={{
            opacity: 0,
            x: 20
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.6
          }} className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent z-10"></div>
              <img className="w-full h-auto object-cover opacity-90 hover:scale-105 transition-transform duration-700" alt="Students collaborating on laptops in a modern university lab" src="https://horizons-cdn.hostinger.com/80504870-35f5-4fc9-ba7f-f8bc12cf282f/nextgen-lab-MbfVX.png" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works - Steps */}
      <section id="process" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Program Structure</h2>
            <p className="text-slate-400 text-lg">A streamlined path from application to full platform mastery.</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[{
            icon: School,
            title: "University Applies",
            desc: "The department head submits an official application to join the NextGen program."
          }, {
            icon: Users,
            title: "Access Grant",
            desc: "Upon approval, university admins can invite lecturers and students to the workspace."
          }, {
            icon: BookOpen,
            title: "Training & Orientation",
            desc: "Students complete mandatory orientation modules and pass an entry assessment."
          }, {
            icon: Unlock,
            title: "Full Access",
            desc: "Successful students unlock the full suite of engineering and geoscience tools."
          }].map((step, idx) => <motion.div key={idx} initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: idx * 0.1,
            duration: 0.5
          }} className="relative p-6 rounded-2xl bg-[#1E293B]/50 border border-slate-700/50 hover:border-[#BFFF00]/30 hover:bg-[#1E293B] transition-all group">
                <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-[#BFFF00] z-20">
                  {idx + 1}
                </div>
                <div className="w-14 h-14 rounded-xl bg-slate-800/80 flex items-center justify-center mb-6 text-[#BFFF00] group-hover:scale-110 transition-transform duration-300">
                  <step.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">{step.desc}</p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* Access Requirements & Duration */}
      <section id="requirements" className="py-20 bg-[#0B1221]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Requirements */}
            <div className="bg-[#162032] rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Access Requirements</h3>
              </div>
              
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Active Enrollment</h4>
                    <p className="text-slate-400 text-sm">Must be a currently enrolled undergraduate or postgraduate student at a partner university.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Institutional Email</h4>
                    <p className="text-slate-400 text-sm">Registration requires a valid .edu or university-provided email address.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Entry Assessment</h4>
                    <p className="text-slate-400 text-sm">Students must pass a basic competency quiz on energy fundamentals and ethics.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Duration */}
            <div className="bg-[#162032] rounded-3xl p-8 border border-slate-800">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">Access Duration</h3>
              </div>
              
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">Undergraduates</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Per Academic Session</p>
                  </div>
                  <span className="text-2xl font-bold text-[#BFFF00]">3 Months</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">Postgraduates</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">Research & Thesis</p>
                  </div>
                  <span className="text-2xl font-bold text-[#BFFF00]">6 Months</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">Alumni Grace Period</h4>
                    <p className="text-xs text-slate-400 uppercase tracking-wider mt-1">After Graduation</p>
                  </div>
                  <span className="text-2xl font-bold text-emerald-400">60 Days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section id="benefits" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why NextGen?</h2>
            <p className="text-slate-400 text-lg">We're preparing the workforce of tomorrow with the tools of today.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 hover:border-[#BFFF00]/20 transition-colors">
              <Laptop className="w-10 h-10 text-[#BFFF00] mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Industry-Ready Skills</h3>
              <p className="text-slate-400">Gain proficiency in the same software used by leading operators, making you hireable from day one.</p>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 hover:border-[#BFFF00]/20 transition-colors">
              <Users className="w-10 h-10 text-emerald-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Campus Ambassadors</h3>
              <p className="text-slate-400">Get support from peer leaders on your campus who provide guidance, workshops, and troubleshooting.</p>
            </div>
            <div className="bg-[#1E293B] p-8 rounded-2xl border border-slate-800 hover:border-[#BFFF00]/20 transition-colors">
              <Globe className="w-10 h-10 text-blue-400 mb-6" />
              <h3 className="text-xl font-bold text-white mb-3">Global Community</h3>
              <p className="text-slate-400">Connect with a network of engineering students and professionals from universities around the world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible Use - Red Accent Section */}
      <section className="py-16 bg-red-950/10 border-y border-red-900/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10 mb-6">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Academic Integrity & Responsible Use</h2>
          <p className="text-slate-300 mb-6">
            Petrolord NextGen maintains strict standards. Accounts are individual and non-transferable. 
            Sharing credentials or using the platform for commercial gain will result in immediate termination of access.
          </p>
          <div className="text-sm text-red-400 font-semibold uppercase tracking-wide">
            Zero Tolerance Policy
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#BFFF00]/10 to-emerald-500/10 opacity-30"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to transform your curriculum?</h2>
          <p className="text-xl text-slate-300 mb-10">Join leading universities partnering with Petrolord to shape the future of energy.</p>
          <Link to="/university-onboarding">
            <Button size="lg" className="h-16 px-12 bg-[#BFFF00] text-black hover:bg-[#a3d900] font-bold text-xl rounded-full shadow-2xl shadow-[#BFFF00]/20 hover:scale-105 transition-transform">
              Begin University Onboarding
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
};
export default LandingPage;