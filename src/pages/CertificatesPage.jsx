import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award, Download, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const CertificatesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchCertificates();
  }, [user]);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          id,
          certificate_number,
          issued_date,
          course:courses (
            title,
            description,
            course_thumbnail_url
          )
        `)
        .eq('user_id', user.id)
        .order('issued_date', { ascending: false });

      if (error) throw error;
      setCertificates(data || []);
    } catch (err) {
      console.error('Error fetching certificates:', err);
      toast({
        title: "Error",
        description: "Failed to load certificates",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = (id) => {
    toast({
      title: "Downloading...",
      description: "Certificate download started.",
    });
    // In a real app, this would trigger a PDF generation/download
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">My Certificates</h1>
          <p className="text-slate-400">View and download your earned credentials.</p>
        </div>
        <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
          <span className="text-sm text-slate-400">Total Earned: </span>
          <span className="text-xl font-bold text-white ml-2">{certificates.length}</span>
        </div>
      </div>

      {certificates.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-slate-800/50 rounded-xl border border-dashed border-slate-700">
          <Award className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300">No Certificates Yet</h3>
          <p className="text-slate-500 max-w-sm text-center mt-2">
            Complete courses to earn professional certificates and badges.
          </p>
          <Button className="mt-4" onClick={() => window.location.href='/dashboard/my-learning'}>
            Browse Courses
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="bg-slate-800 border-slate-700 hover:border-blue-500/50 transition-all overflow-hidden group">
              <div className="h-32 bg-gradient-to-r from-blue-900 to-slate-900 relative">
                 <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <Award className="w-16 h-16 text-white" />
                 </div>
                 <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>
                 </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{cert.course?.title}</h3>
                <p className="text-sm text-slate-400 mb-4 line-clamp-2">{cert.course?.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Issued On</span>
                    <span className="text-slate-300 font-medium">
                      {new Date(cert.issued_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Credential ID</span>
                    <span className="text-slate-300 font-mono text-xs bg-slate-900 px-2 py-1 rounded">
                      {cert.certificate_number}
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700" 
                    onClick={() => downloadCertificate(cert.id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" className="border-slate-600 hover:bg-slate-700 text-slate-300">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;