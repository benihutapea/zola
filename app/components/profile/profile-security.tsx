'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { useUser } from '@/lib/user-store/provider'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { KeyRound, LogOut, AlertTriangle } from 'lucide-react'

export function ProfileSecurity() {
  const { user, signOut } = useUser()
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false)
  
  const handleChangePassword = async () => {
    try {
      // This would be implemented with an actual password change API call
      // For now, we'll just show a toast
      toast.success('Password reset email sent', {
        description: 'Check your inbox for instructions to reset your password'
      })
    } catch (error) {
      toast.error('Failed to send password reset email')
    }
  }
  
  const handleDeleteAccount = async () => {
    try {
      // This would be implemented with an actual account deletion API
      // For now, we'll just close the dialog and show a toast
      setShowDeleteDialog(false)
      toast.success('Account deletion requested', {
        description: 'Your account will be deleted within 24 hours'
      })
    } catch (error) {
      toast.error('Failed to delete account')
    }
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-2">Email Address</h3>
            <div className="flex items-center gap-2">
              <Input value={user?.email || ''} disabled className="max-w-md" />
              <Button variant="outline" disabled>Change Email</Button>
            </div>
            <p className="text-sm text-muted-foreground mt-1.5">
              Your email address is used for login and notifications
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Password</h3>
            <Button onClick={handleChangePassword} variant="outline">
              <KeyRound className="mr-2 h-4 w-4" />
              Reset Password
            </Button>
            <p className="text-sm text-muted-foreground mt-1.5">
              We'll send you an email with instructions to reset your password
            </p>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Session</h3>
            <Button variant="outline" onClick={() => signOut()}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout of all devices
            </Button>
            <p className="text-sm text-muted-foreground mt-1.5">
              This will end all your active sessions and require you to log in again
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Actions here cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Delete Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccount}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete my account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <p className="text-sm text-muted-foreground mt-2">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}