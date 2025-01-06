'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileDown } from "lucide-react";

export default function BulkImportPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Bulk Import Users</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn how to import multiple users at once using CSV files
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>CSV File Format</CardTitle>
            <CardDescription>
              Your CSV file should follow this format for each user type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Teachers Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted p-2 rounded-md block">
                    email,name,subjects,phoneNumber<br />
                    teacher1@school.com,John Doe,"Math,Science",+1234567890<br />
                    teacher2@school.com,Jane Smith,"English,History",+0987654321
                  </code>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Required Fields:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>email - Teacher&apos;s email address</li>
                      <li>name - Full name</li>
                      <li>subjects - Comma-separated list of subjects</li>
                      <li>phoneNumber - Contact number (optional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Students Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-muted p-2 rounded-md block">
                    email,name,grade,class<br />
                    student1@school.com,Alice Johnson,10,A<br />
                    student2@school.com,Bob Wilson,10,B
                  </code>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium">Required Fields:</p>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>email - Student&apos;s email address</li>
                      <li>name - Full name</li>
                      <li>grade - Student&apos;s grade level</li>
                      <li>class - Class section</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Download Templates</h3>
              <div className="flex gap-4">
                <Link href="/templates/teacher-import-template.csv">
                  <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Teacher Template
                  </Button>
                </Link>
                <Link href="/templates/student-import-template.csv">
                  <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Student Template
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Important Notes</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>The first row of your CSV file must contain the column headers exactly as shown above</li>
                <li>Email addresses must be unique across the platform</li>
                <li>All users will receive an email to set their password</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported file format: .csv only</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Steps to Import</h3>
              <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-2">
                <li>Download the appropriate template</li>
                <li>Fill in the user details following the format</li>
                <li>Save the file as CSV</li>
                <li>Go to School Admin Dashboard</li>
                <li>Click &quot;Import Users&quot;</li>
                <li>Select your CSV file</li>
                <li>Review the preview and confirm</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Error Handling</h3>
              <p className="text-sm text-muted-foreground">
                If there are any errors in your CSV file, the system will:
              </p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
                <li>Show exactly which rows have errors</li>
                <li>Explain what the errors are</li>
                <li>Allow you to fix and retry</li>
                <li>Not import any users until all errors are resolved</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
