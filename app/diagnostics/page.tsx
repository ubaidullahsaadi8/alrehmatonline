'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DiagnosticsPage() {
  const [dbStatus, setDbStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [dbMessage, setDbMessage] = useState<string>('');
  const [dbDetails, setDbDetails] = useState<any>(null);
  
  const [columnStatus, setColumnStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [columnMessage, setColumnMessage] = useState<string>('');
  
  const [preferenceStatus, setPreferenceStatus] = useState<'loading' | 'success' | 'error' | null>(null);
  const [preferenceMessage, setPreferenceMessage] = useState<string>('');
  const [currentCurrency, setCurrentCurrency] = useState<string>('');
  
  // Test database connection
  const testDatabaseConnection = async () => {
    setDbStatus('loading');
    try {
      const response = await fetch('/api/diagnostics/db-connection');
      const data = await response.json();
      
      if (data.success) {
        setDbStatus('success');
        setDbMessage('Database connection successful');
      } else {
        setDbStatus('error');
        setDbMessage(data.error || 'Unknown database error');
      }
      
      setDbDetails(data.diagnostics);
    } catch (error) {
      setDbStatus('error');
      setDbMessage(error instanceof Error ? error.message : 'Failed to connect to database');
    }
  };
  
  
  const addCurrencyColumn = async () => {
    setColumnStatus('loading');
    try {
      const response = await fetch('/api/migrations/add-currency-column');
      const data = await response.json();
      
      if (data.success) {
        setColumnStatus('success');
        setColumnMessage(data.alreadyExists 
          ? 'Currency column already exists' 
          : 'Currency column added successfully');
      } else {
        setColumnStatus('error');
        setColumnMessage(data.error || 'Failed to add currency column');
      }
    } catch (error) {
      setColumnStatus('error');
      setColumnMessage(error instanceof Error ? error.message : 'Failed to add currency column');
    }
  };
  
  
  const testPreference = async () => {
    setPreferenceStatus('loading');
    try {
      const response = await fetch('/api/user/preferences');
      const data = await response.json();
      
      if (response.ok) {
        setPreferenceStatus('success');
        setPreferenceMessage('Successfully retrieved currency preference');
        setCurrentCurrency(data.currency || 'USD');
      } else {
        setPreferenceStatus('error');
        setPreferenceMessage(data.error || 'Failed to get currency preference');
      }
    } catch (error) {
      setPreferenceStatus('error');
      setPreferenceMessage(error instanceof Error ? error.message : 'Failed to get currency preference');
    }
  };
  
  
  useEffect(() => {
    testDatabaseConnection();
    addCurrencyColumn();
    testPreference();
  }, []);
  
  const StatusIcon = ({ status }: { status: 'loading' | 'success' | 'error' | null }) => {
    if (status === 'loading') return <Loader2 className="h-5 w-5 animate-spin text-blue-500" />;
    if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'error') return <XCircle className="h-5 w-5 text-red-500" />;
    return <AlertCircle className="h-5 w-5 text-gray-300" />;
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Database Diagnostics</h1>
      
      <div className="grid gap-6">
        {}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={dbStatus} />
              Database Connection
            </CardTitle>
            <Button variant="outline" size="sm" onClick={testDatabaseConnection} 
              disabled={dbStatus === 'loading'}>
              {dbStatus === 'loading' ? 'Testing...' : 'Test Connection'}
            </Button>
          </CardHeader>
          <CardContent>
            {dbStatus === 'loading' && (
              <div className="flex items-center gap-2 text-blue-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Testing database connection...
              </div>
            )}
            {dbStatus === 'success' && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Connection Successful</AlertTitle>
                <AlertDescription>{dbMessage}</AlertDescription>
              </Alert>
            )}
            {dbStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTitle>Connection Failed</AlertTitle>
                <AlertDescription>{dbMessage}</AlertDescription>
              </Alert>
            )}
            
            {dbDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="text-sm font-semibold mb-2">Connection Details:</h3>
                <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
                  {JSON.stringify(dbDetails, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
        
        {}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={columnStatus} />
              Currency Column
            </CardTitle>
            <Button variant="outline" size="sm" onClick={addCurrencyColumn}
              disabled={columnStatus === 'loading'}>
              {columnStatus === 'loading' ? 'Checking...' : 'Add Column'}
            </Button>
          </CardHeader>
          <CardContent>
            {columnStatus === 'loading' && (
              <div className="flex items-center gap-2 text-blue-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Checking currency column...
              </div>
            )}
            {columnStatus === 'success' && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Column Check Successful</AlertTitle>
                <AlertDescription>{columnMessage}</AlertDescription>
              </Alert>
            )}
            {columnStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTitle>Column Check Failed</AlertTitle>
                <AlertDescription>{columnMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        
        {}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <StatusIcon status={preferenceStatus} />
              Current Preference
            </CardTitle>
            <Button variant="outline" size="sm" onClick={testPreference}
              disabled={preferenceStatus === 'loading'}>
              {preferenceStatus === 'loading' ? 'Checking...' : 'Check Preference'}
            </Button>
          </CardHeader>
          <CardContent>
            {preferenceStatus === 'loading' && (
              <div className="flex items-center gap-2 text-blue-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Retrieving currency preference...
              </div>
            )}
            {preferenceStatus === 'success' && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertTitle>Preference Retrieved</AlertTitle>
                <AlertDescription>
                  Your current currency preference is: <strong>{currentCurrency}</strong>
                </AlertDescription>
              </Alert>
            )}
            {preferenceStatus === 'error' && (
              <Alert variant="destructive">
                <AlertTitle>Preference Check Failed</AlertTitle>
                <AlertDescription>{preferenceMessage}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
