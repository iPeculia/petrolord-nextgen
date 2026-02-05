import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UniversityAdminService } from '@/services/universityAdminService';
import { format } from 'date-fns';
import StudentDetailModal from './StudentDetailModal';

const UniversityStudentsTab = ({ universityId }) => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (universityId) {
      UniversityAdminService.getStudents(universityId).then(setStudents);
    }
  }, [universityId]);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleViewDetails = (studentId) => {
      setSelectedStudentId(studentId);
      setIsDetailOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1E293B] p-4 rounded-lg border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search students by name or ID..." 
            className="pl-9 bg-[#0F172A] border-slate-700 text-white" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-2 rounded border border-slate-800">
            <Shield className="w-3 h-3" />
            <span>Students are enrolled by Super Admin via CSV</span>
        </div>
      </div>

      <Card className="bg-[#1E293B] border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Student Roster</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#0F172A]">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Student Name</TableHead>
                <TableHead className="text-slate-400">Level</TableHead>
                {/* Department column removed */}
                <TableHead className="text-slate-400">Enrolled Date</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-200">
                        {student.name}
                        <div className="text-xs text-slate-500">{student.email}</div>
                    </TableCell>
                    <TableCell className="text-slate-400">{student.level || 'N/A'}</TableCell>
                    <TableCell className="text-slate-400 text-xs font-mono">
                        {student.created_at ? format(new Date(student.created_at), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={`
                            ${student.status === 'active' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-slate-400 border-slate-700 bg-slate-800'}
                        `}>
                            {student.status || 'Active'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                        onClick={() => handleViewDetails(student.id)}
                    >
                        <Eye className="w-3 h-3 mr-2" /> View Details
                    </Button>
                    </TableCell>
                </TableRow>
              ))}
               {filteredStudents.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                          No students found.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <StudentDetailModal 
        studentId={selectedStudentId}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
};

export default UniversityStudentsTab;