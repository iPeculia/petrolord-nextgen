import React from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CertificateCard = ({ certificate, course, profile }) => {
    if (!certificate || !course || !profile) {
        return null;
    }

    const issuedDate = new Date(certificate.issued_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const handleDownload = () => {
        // This is a placeholder for actual certificate generation/download
        alert("🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative bg-gradient-to-br from-slate-800 to-slate-900 border border-yellow-500 rounded-lg p-6 shadow-lg overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img className="w-full h-full object-cover" alt="Certificate background pattern" src="https://images.unsplash.com/photo-1519290685693-c99eee1a16d7" />
            </div>
            <div className="relative z-10 text-center">
                <h3 className="text-3xl font-extrabold text-yellow-400 mb-4">Certificate of Completion</h3>
                <p className="text-lg text-gray-300 mb-2">This certifies that</p>
                <p className="text-4xl font-bold text-white mb-4">{profile.display_name || profile.email}</p>
                <p className="text-lg text-gray-300 mb-2">has successfully completed the course</p>
                <p className="text-3xl font-semibold text-yellow-300 mb-6">{course.title}</p>
                <div className="flex justify-center items-center space-x-4 text-gray-400 text-sm mb-6">
                    <span>Issued on: {issuedDate}</span>
                    <span>Certificate No: <span className="font-mono text-yellow-200">{certificate.certificate_number}</span></span>
                </div>
                <Button
                    onClick={handleDownload}
                    className="bg-yellow-500 text-slate-900 hover:bg-yellow-400 font-semibold"
                >
                    <Download className="w-4 h-4 mr-2" /> Download Certificate
                </Button>
            </div>
        </motion.div>
    );
};

export default CertificateCard;