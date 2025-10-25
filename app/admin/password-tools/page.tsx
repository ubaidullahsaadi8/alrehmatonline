"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useForm } from "react-hook-form"

export default function PasswordTesterPage() {
  const [users, setUsers] = useState([])
  const [passwordInfo, setPasswordInfo] = useState(null)
  const [testResult, setTestResult] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Form for diagnostics
  const diagnosticsForm = useForm({
    defaultValues: {
      userId: '',
      password: '',
      testHash: ''
    }
  })
  
  // Form for direct reset
  const resetForm = useForm({
    defaultValues: {
      userId: '',
      newPassword: ''
    }
  })
  
  // Fetch user list on load
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch('/api/admin/users')
        const data = await res.json()
        
        if (data.error) {
          setError(data.error)
          return
        }
        
        setUsers(data.users || [])
      } catch (err) {
        setError('Failed to load users: ' + (err.message || String(err)))
      }
    }
    
    fetchUsers()
  }, [])
  
  
  useEffect(() => {
    async function fetchPasswordInfo() {
      try {
        const res = await fetch('/api/admin/diagnostics/password')
        const data = await res.json()
        
        if (data.error) {
          setError(data.error)
          return
        }
        
        setPasswordInfo(data)
      } catch (err) {
        setError('Failed to load password diagnostics: ' + (err.message || String(err)))
      }
    }
    
    fetchPasswordInfo()
  }, [])
  
  
  const onDiagnosticsSubmit = async (values) => {
    setError('')
    setSuccess('')
    setTestResult(null)
    
    try {
      const res = await fetch('/api/admin/diagnostics/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setTestResult(data.results)
      setSuccess('Password tests completed successfully')
    } catch (err) {
      setError('Failed to test password: ' + (err.message || String(err)))
    }
  }
  
  
  const onResetSubmit = async (values) => {
    setError('')
    setSuccess('')
    
    try {
      const res = await fetch('/api/admin/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      })
      
      const data = await res.json()
      
      if (data.error) {
        setError(data.error)
        return
      }
      
      setSuccess(`Password reset successfully for ${data.user?.name || data.user?.email || values.userId}`)
      resetForm.reset()
    } catch (err) {
      setError('Failed to reset password: ' + (err.message || String(err)))
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Password Management Tools</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="diagnostics" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="diagnostics">Password Diagnostics</TabsTrigger>
          <TabsTrigger value="reset">Direct Password Reset</TabsTrigger>
          <TabsTrigger value="info">System Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value="diagnostics">
          <Card>
            <CardHeader>
              <CardTitle>Password Testing</CardTitle>
              <CardDescription>Test password verification and hashing functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...diagnosticsForm}>
                <form onSubmit={diagnosticsForm.handleSubmit(onDiagnosticsSubmit)} className="space-y-4">
                  <FormField
                    control={diagnosticsForm.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User (Optional)</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={diagnosticsForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password to Test</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={diagnosticsForm.control}
                    name="testHash"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hash to Test Against (Optional)</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Run Password Tests</Button>
                </form>
              </Form>
              
              {testResult && (
                <div className="mt-8">
                  <h3 className="text-lg font-medium mb-4">Test Results</h3>
                  
                  <div className="space-y-4">
                    {testResult.tests.map((test, index) => (
                      <Card key={index}>
                        <CardHeader>
                          <CardTitle className="text-md">{test.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                            {JSON.stringify(test, null, 2)}
                          </pre>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reset">
          <Card>
            <CardHeader>
              <CardTitle>Direct Password Reset</CardTitle>
              <CardDescription>Reset user password without verification</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="userId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>User</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {users.map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name || user.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit">Reset Password</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Password System Information</CardTitle>
              <CardDescription>Information about the current password storage</CardDescription>
            </CardHeader>
            <CardContent>
              {passwordInfo ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">bcrypt Info</h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                      {JSON.stringify(passwordInfo.bcryptInfo, null, 2)}
                    </pre>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Password Hash Statistics</h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                      {JSON.stringify(passwordInfo.hashStats, null, 2)}
                    </pre>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Password Hash Samples</h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                      {JSON.stringify(passwordInfo.passwordHashSamples, null, 2)}
                    </pre>
                  </div>
                </div>
              ) : (
                <p>Loading password system information...</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
