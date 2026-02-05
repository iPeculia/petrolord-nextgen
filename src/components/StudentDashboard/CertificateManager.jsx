import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Download, Search, Share2, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Card } from '@/components/ui/card';

const CertificateManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          courses ( title, description )
        `)
        .eq('user_id', user.id)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to load certificates.' });
    } finally {
      setLoading(false);
    }
  };

  const filteredCerts = certificates.filter(cert => 
    cert.courses?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.certificate_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownload = (cert) => {
     toast({ title: "Downloading...", description: `Certificate ${cert.certificate_number} download started.` });
     // Implement PDF generation logic here
  };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
               <Award className="h-8 w-8 text-yellow-400" />
               My Certificates
            </h1>
            <p className="mt-1 text-slate-400">View and download your earned credentials.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input 
                placeholder="Search certificates..." 
                className="w-full min-w-[250px] bg-slate-900 border-slate-700 pl-9 text-white focus:border-yellow-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
             {[1,2,3].map(i => <div key={i} className="h-64 animate-pulse rounded-xl bg-slate-900" />)}
           </div>
        ) : (
          <AnimatePresence>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCerts.length > 0 ? (
                filteredCerts.map((cert, index) => (
                  <motion.div
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900 p-1 shadow-2xl"
                  >
                    {/* Decorative border gradient */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 opacity-20 group-hover:opacity-40 transition-opacity" />
                    
                    <div className="relative h-full rounded-lg bg-slate-950 p-6">
                       {/* Background Pattern */}
                       <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

                       <div className="relative z-10 flex h-full flex-col justify-between">
                          <div className="space-y-4">
                             <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-500/50">
                                <Award className="h-6 w-6 text-yellow-500" />
                             </div>
                             <div>
                                <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                   {cert.courses?.title}
                                </h3>
                                <p className="text-sm text-slate-400 mt-1">
                                   Issued: {new Date(cert.issued_date).toLocaleDateString()}
                                </p>
                             </div>
                             <div className="rounded-md bg-slate-900 px-3 py-2 font-mono text-xs text-slate-500 border border-slate-800">
                                ID: {cert.certificate_number}
                             </div>
                          </div>

                          <div className="mt-6 flex gap-2">
                             <Button onClick={() => handleDownload(cert)} className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/10">
                                <Download className="mr-2 h-4 w-4" /> PDF
                             </Button>
                             <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                <Share2 className="h-4 w-4" />
                             </Button>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500">
                  <Award className="mb-4 h-16 w-16 opacity-20" />
                  <p className="text-lg">No certificates found matching your search.</p>
                </div>
              )}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default CertificateManager;