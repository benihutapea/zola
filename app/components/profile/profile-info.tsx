'use client'

import React, { useState } from 'react'
import { useUser } from '@/lib/user-store/provider'
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { PencilIcon, SaveIcon, UserIcon } from 'lucide-react'

export function ProfileInfo() {
  const { user } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(user?.display_name || '')
  const [bio, setBio] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  if (!user) return null
  
  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // In a real implementation, this would be an API call to update the user profile
      // await fetch('/api/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ displayName, bio })
      // })
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast.success('Profile updated successfully')
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-28 w-28">
              <AvatarImage src={user?.profile_image || undefined} />
              <AvatarFallback className="text-4xl">
                <UserIcon className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            
            <Button variant="outline" size="sm" disabled>
              Change avatar
            </Button>
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{isEditing ? 'Edit Profile' : 'Profile'}</h1>
              
              {isEditing ? (
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      setIsEditing(false)
                      setDisplayName(user?.display_name || '')
                      setBio('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                    {!isSaving && <SaveIcon className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                >
                  <PencilIcon className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Email
                </label>
                <div className="text-base">{user?.email}</div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Display Name
                </label>
                {isEditing ? (
                  <Input 
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    maxLength={50}
                  />
                ) : (
                  <div className="text-base">{user?.display_name || 'Not set'}</div>
                )}
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1.5">
                  Bio
                </label>
                {isEditing ? (
                  <Textarea 
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself"
                    maxLength={200}
                    className="resize-none"
                    rows={4}
                  />
                ) : (
                  <div className="text-base whitespace-pre-wrap">
                    {bio || 'No bio provided'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}