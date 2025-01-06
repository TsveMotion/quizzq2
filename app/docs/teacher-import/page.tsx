'use client';

import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export default function TeacherImportDocumentation() {
  const downloadTemplate = () => {
    // Create CSV content
    const csvContent = `Name,Email,Subject
John Smith,john.smith@example.com,Mathematics
Jane Doe,jane.doe@example.com,Science`;

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teacher_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Teacher Import Documentation</h1>
          <p className="text-muted-foreground">
            Learn how to properly format your Excel or CSV file for bulk importing teachers.
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">File Format Requirements</h2>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>File must be in .xlsx (Excel) or .csv format</li>
            <li>First row must contain column headers</li>
            <li>Required columns: Name, Email</li>
            <li>Optional columns: Subject</li>
            <li>Each row represents one teacher</li>
          </ul>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Column Specifications:</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Column</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Example</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Full name of the teacher</TableCell>
                  <TableCell>John Smith</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Email</TableCell>
                  <TableCell>Yes</TableCell>
                  <TableCell>Valid email address (must be unique)</TableCell>
                  <TableCell>john.smith@example.com</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Subject</TableCell>
                  <TableCell>No</TableCell>
                  <TableCell>Main subject taught by the teacher</TableCell>
                  <TableCell>Mathematics</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Important Notes:</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email addresses must be unique across all users in the system</li>
              <li>A random 8-character password will be generated for each teacher</li>
              <li>The generated password will be sent to the teacher&apos;s email address</li>
              <li>Teachers should change their password after their first login</li>
              <li>Maximum file size: 5MB</li>
              <li>Maximum 100 teachers per import</li>
            </ul>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Example and Template</h2>
          <p className="mb-4">
            Download our template file to get started. The template includes example data that you can replace with your own.
          </p>
          <Button onClick={downloadTemplate}>
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Common Issues</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-500">Duplicate Emails</h3>
              <p>Each email address must be unique. The import will fail if any email is already in use.</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-500">Invalid File Format</h3>
              <p>Make sure your file is saved as .xlsx or .csv and follows the required column structure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-red-500">Missing Required Fields</h3>
              <p>Name and Email are required for each teacher. Empty values will cause the import to fail.</p>
            </div>
          </div>
        </Card>

        <div className="text-center text-muted-foreground">
          <p>Need more help? Contact your system administrator or visit our{' '}
            <Link href="/support" className="text-primary hover:underline">
              support page
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
