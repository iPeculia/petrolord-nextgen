import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DataPreviewTable = ({ data, title }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No data available to display.</p>
        </CardContent>
      </Card>
    );
  }

  const headers = Object.keys(data[0] || {});
  const previewData = data.slice(0, 10); // Show first 10 rows

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableCaption>
              {data.length > 10
                ? `Showing first 10 of ${data.length} rows.`
                : `A preview of the loaded data.`}
            </TableCaption>
            <TableHeader>
              <TableRow>
                {headers.map((header) => (
                  <TableHead key={header} className="font-bold">{header.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {previewData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header) => (
                    <TableCell key={`${rowIndex}-${header}`}>
                      {typeof row[header] === 'number' ? row[header].toFixed(2) : row[header]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPreviewTable;