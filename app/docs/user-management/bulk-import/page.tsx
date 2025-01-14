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
import { FileDown, Sparkles, Upload } from "lucide-react";
import { motion } from 'framer-motion';

export default function BulkImportPage() {
  return (
    <div className="max-w-4xl space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6 inline-block rounded-full bg-white/20 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="flex items-center text-sm font-medium text-white">
            <Sparkles className="mr-2 h-4 w-4 text-blue-200" />
            Bulk Import
          </span>
        </motion.div>

        <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-blue-100 to-white">
          Bulk Import Users
        </h1>
        <p className="text-xl text-white/80">
          Learn how to import multiple users at once using CSV files
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <Card className="bg-white/10 border-white/20 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">CSV File Format</CardTitle>
            <CardDescription className="text-white/60">
              Your CSV file should follow this format for each user type
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-base text-white">Teachers Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-black/30 p-2 rounded-md block text-blue-200">
                    email,name,subjects,phoneNumber<br />
                    teacher1@school.com,John Doe,"Math,Science",+1234567890<br />
                    teacher2@school.com,Jane Smith,"English,History",+0987654321
                  </code>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-white">Required Fields:</p>
                    <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                      <li>email - Teacher&apos;s email address</li>
                      <li>name - Full name</li>
                      <li>subjects - Comma-separated list of subjects</li>
                      <li>phoneNumber - Contact number (optional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-base text-white">Students Format</CardTitle>
                </CardHeader>
                <CardContent>
                  <code className="text-sm bg-black/30 p-2 rounded-md block text-blue-200">
                    email,name,class<br />
                    student1@school.com,Alice Johnson,Class A<br />
                    student2@school.com,Bob Wilson,Class B<br />
                    student3@school.com,Carol Smith,
                  </code>
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-white">Required Fields:</p>
                    <ul className="list-disc list-inside text-sm text-white/60 space-y-1">
                      <li>email - Student&apos;s email address</li>
                      <li>name - Full name</li>
                      <li>class - Class name (optional)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Download Templates</h3>
              <div className="flex gap-4">
                <Link href="/templates/teacher-import-template.csv">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                    <FileDown className="h-4 w-4" />
                    Teacher Template
                  </Button>
                </Link>
                <Link href="/templates/student-import-template.csv">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                    <FileDown className="h-4 w-4" />
                    Student Template
                  </Button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Important Notes</h3>
              <ul className="list-disc list-inside text-sm text-white/60 space-y-2">
                <li>The first row of your CSV file must contain the column headers exactly as shown above</li>
                <li>Email addresses must be unique across the platform</li>
                <li>All users will receive an email to set their password</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported file format: .csv only</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Steps to Import</h3>
              <ol className="list-decimal list-inside text-sm text-white/60 space-y-2">
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
              <h3 className="text-lg font-semibold text-white">Error Handling</h3>
              <p className="text-sm text-white/60">
                If there are any errors in your CSV file, the system will:
              </p>
              <ul className="list-disc list-inside text-sm text-white/60 space-y-2">
                <li>Show exactly which rows have errors</li>
                <li>Explain what the errors are</li>
                <li>Allow you to fix and retry</li>
                <li>Not import any users until all errors are resolved</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
