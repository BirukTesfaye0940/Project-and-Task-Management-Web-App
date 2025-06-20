"use client"

import { useState } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { sendInvitation, resetInvitationState } from "@/store/slices/invitationSlice"
import { Loader2, Users } from "lucide-react"

interface InviteUserDialogProps {
  projectId: string
}

export const InviteUserDialog = ({ projectId }: InviteUserDialogProps) => {
  const dispatch = useAppDispatch()
  // FIX: Destructure error and success from the Redux state
  const { loading, error, success } = useAppSelector((state) => state.invite)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    email: "",
    role: "admin",
    projectId,
  })

  const handleSend = () => {
    dispatch(sendInvitation(form)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        // Only close and reset on successful invitation
        setOpen(false)
        setForm({ ...form, email: "", role: "admin" }) // Reset fields, keep projectId
        // Dispatch resetInvitationState after a short delay to allow success message to be seen
        setTimeout(() => {
          dispatch(resetInvitationState())
        }, 3000) // Display success message for 3 seconds
      }
      // Note: error state is automatically handled by the extraReducers,
      // so no need to explicitly check res.meta.requestStatus === "rejected" here
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Users className="w-4 h-4 mr-2" />
          Invite Team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Enter the user's email and select a role to invite them to your project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="e.g. someone@example.com"
              type="email"
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(val) => setForm({ ...form, role: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display error and success messages in the main content area */}
          {error && (
            <div className="p-3 rounded-md bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          {success && (
            <div className="p-3 rounded-md bg-green-50 border border-green-200">
              <p className="text-sm text-green-600">Invitation sent successfully!</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4">
          <Button onClick={handleSend} disabled={loading} className="w-full">
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
