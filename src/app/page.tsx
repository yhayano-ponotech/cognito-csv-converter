// app/page.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadIcon, FileIcon, DownloadIcon, RefreshCwIcon } from 'lucide-react';

// Import JSON to CSV converter
import { parseJsonAndConvertToCsv } from '@/lib/jsonToCsvConverter';

export default function Home() {
  const [jsonInput, setJsonInput] = useState<string>('');
  const [csvOutput, setCsvOutput] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [isJsonValid, setIsJsonValid] = useState(true);
  const [fileName, setFileName] = useState('users_converted.csv');

  // Handle JSON file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    
    // Update file name for download, but keep .csv extension
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setFileName(`${baseName}_converted.csv`);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        setJsonInput(jsonString);
        
        // Validate JSON
        JSON.parse(jsonString);
        setIsJsonValid(true);
      } catch (e) {
        setIsJsonValid(false);
        setError(`Invalid JSON file. Please check the file format.: ${e instanceof Error ? e.message : String(e)}`);
      }
    };
    reader.readAsText(file);
  };

  // Convert JSON to CSV
  const handleConvert = () => {
    if (!jsonInput.trim()) {
      setError('Please enter JSON data or upload a file.');
      return;
    }

    setIsConverting(true);
    setError(null);

    try {
      const csvData = parseJsonAndConvertToCsv(jsonInput);
      setCsvOutput(csvData);
    } catch (e) {
      setError(`Conversion error: ${e instanceof Error ? e.message : String(e)}`);
      setCsvOutput('');
    } finally {
      setIsConverting(false);
    }
  };

  // Download CSV file
  const handleDownload = () => {
    if (!csvOutput) {
      setError('No CSV data to download. Please convert data first.');
      return;
    }

    const blob = new Blob([csvOutput], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear all data
  const handleClear = () => {
    setJsonInput('');
    setCsvOutput('');
    setError(null);
    setIsJsonValid(true);
    setFileName('users_converted.csv');
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mx-auto max-w-4xl shadow-lg">
        <CardHeader className="bg-slate-50 dark:bg-slate-800">
          <CardTitle className="text-2xl font-bold text-center">JSON to CSV Converter</CardTitle>
          <CardDescription className="text-center">
            Convert Cognito User JSON data to CSV format with proper formatting
          </CardDescription>
        </CardHeader>
        
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-2 mx-8 mt-4">
            <TabsTrigger value="upload">File Upload</TabsTrigger>
            <TabsTrigger value="paste">Paste JSON</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="p-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
              <UploadIcon className="h-12 w-12 text-gray-400 mb-4" />
              <Label 
                htmlFor="file-upload" 
                className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                Select JSON File
              </Label>
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <p className="mt-2 text-sm text-gray-500">
                {jsonInput ? 'File loaded successfully!' : 'Upload your users.json file'}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="paste" className="p-4">
            <Textarea
              placeholder="Paste your JSON data here..."
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                try {
                  if (e.target.value) {
                    JSON.parse(e.target.value);
                    setIsJsonValid(true);
                    setError(null);
                  }
                } catch {
                  setIsJsonValid(false);
                }
              }}
              className="min-h-[200px] resize-none font-mono text-sm"
            />
          </TabsContent>
        </Tabs>

        {!isJsonValid && jsonInput && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertTitle>Invalid JSON</AlertTitle>
              <AlertDescription>
                The provided JSON is not valid. Please check the format and try again.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {error && (
          <div className="px-6 pt-4">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="pt-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center gap-2">
              <Button 
                onClick={handleConvert} 
                disabled={isConverting || !jsonInput || !isJsonValid}
                className="flex-1"
              >
                {isConverting ? <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" /> : <FileIcon className="mr-2 h-4 w-4" />}
                Convert to CSV
              </Button>
              
              <Button 
                onClick={handleClear} 
                variant="outline"
              >
                Clear All
              </Button>
            </div>

            {csvOutput && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold">CSV Output</h3>
                  <div className="flex items-center gap-2">
                    <Input
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-64 text-sm"
                    />
                    <Button 
                      onClick={handleDownload} 
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <DownloadIcon className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea
                  value={csvOutput}
                  readOnly
                  className="w-full h-[200px] font-mono text-sm"
                />
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="bg-slate-50 dark:bg-slate-800 flex flex-col items-start text-sm text-gray-500">
          <p className="mb-1">✓ Properly formats timestamps as epoch milliseconds</p>
          <p className="mb-1">✓ Uses email as username for compatibility</p>
          <p className="mb-1">✓ Handles all required attributes from template.csv</p>
        </CardFooter>
      </Card>
    </main>
  );
}