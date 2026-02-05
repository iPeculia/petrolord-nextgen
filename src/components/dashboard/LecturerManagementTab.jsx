import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Mail, Filter, Edit2, Shield } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { UniversityAdminService } from '@/services/universityAdminService';

const UniversityLecturersTab = ({ universityId }) => {
  const [lecturers, setLecturers] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (universityId) {
      UniversityAdminService.getLecturers(universityId).then(setLecturers);
    }
  }, [universityId]);

  const filteredLecturers = lecturers.filter(l => 
    l.name.toLowerCase().includes(search.toLowerCase()) || 
    l.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#1E293B] p-4 rounded-lg border border-slate-800">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search lecturers by name or email..." 
            className="pl-9 bg-[#0F172A] border-slate-700 text-white" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-900/50 px-3 py-2 rounded border border-slate-800">
            <Shield className="w-3 h-3" />
            <span>Staff management is handled by Super Admin</span>
        </div>
      </div>

      <Card className="bg-[#1E293B] border-slate-800 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">Lecturers Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-[#0F172A]">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Name</TableHead>
                <TableHead className="text-slate-400">Department</TableHead>
                <TableHead className="text-slate-400">Contact</TableHead>
                <TableHead className="text-slate-400">Status</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLecturers.map((lecturer) => (
                <TableRow key={lecturer.id} className="border-slate-800 hover:bg-slate-800/50">
                    <TableCell className="font-medium text-slate-200">
                        {lecturer.name}
                        <div className="text-xs text-slate-500">ID: {lecturer.id.slice(0, 8)}...</div>
                    </TableCell>
                    <TableCell className="text-slate-400">{lecturer.university_departments?.name || 'Unassigned'}</TableCell>
                    <TableCell className="text-slate-400">
                    <div className="flex flex-col gap-1">
                        <span className="flex items-center text-xs text-blue-400"><Mail className="w-3 h-3 mr-1"/> {lecturer.email}</span>
                    </div>
                    </TableCell>
                    <TableCell>
                        <Badge variant="outline" className={`
                            ${lecturer.status === 'active' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/10' : 'text-slate-400 border-slate-700 bg-slate-800'}
                        `}>
                            {lecturer.status || 'Active'}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-800">
                        <Edit2 className="w-3 h-3 mr-2" /> Edit Info
                    </Button>
                    </TableCell>
                </TableRow>
              ))}
              {filteredLecturers.length === 0 && (
                  <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                          No lecturers found.
                      </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default UniversityLecturersTab;