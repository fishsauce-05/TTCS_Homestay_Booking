"use client"

import { ChangeEvent, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, BadgeCheck, CircleUserRound, Mail, Phone, Shield, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export default function ProfilePage() {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [fullName, setFullName] = useState("Admin User")
  const [nickName, setNickName] = useState("Admin")
  const [phone, setPhone] = useState("(+84) 847-318-696")
  const [address, setAddress] = useState("Hà Nội, Việt Nam")
  const [email, setEmail] = useState("booking@fishsaucehomestay.vn")
  const [emailVerified, setEmailVerified] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const passwordMatch = useMemo(() => {
    if (!newPassword && !confirmPassword) return true
    return newPassword === confirmPassword
  }, [newPassword, confirmPassword])

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const objectUrl = URL.createObjectURL(file)
    setAvatarPreview(objectUrl)
  }

  function handleSaveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
  }

  return (
    <div className="min-h-svh bg-[#F5EEDC] px-4 py-8 text-[#183B4E] md:px-6 md:py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#27548A]">Fishsauce Account</p>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">Chỉnh sửa hồ sơ cá nhân</h1>
          </div>
          <Link
            href="/home/customer"
            className="inline-flex items-center gap-2 rounded-lg border border-[#27548A]/30 bg-white px-3 py-2 text-sm font-medium text-[#27548A] transition hover:bg-[#27548A] hover:text-[#F5EEDC]"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại Home
          </Link>
        </div>

        <form onSubmit={handleSaveProfile} className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <Card className="border-[#DDA853]/45 bg-white/95">
            <CardHeader>
              <CardTitle className="text-[#183B4E]">Ảnh đại diện</CardTitle>
              <CardDescription>Chỉnh avatar cho tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-[#27548A]/35 bg-[#F5EEDC]">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <CircleUserRound className="h-10 w-10 text-[#27548A]" />
                  )}
                </div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#27548A] px-3 py-2 text-sm font-medium text-[#F5EEDC] transition hover:bg-[#1e3f6a]">
                  <Upload className="h-4 w-4" />
                  Chọn ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#DDA853]/45 bg-white/95">
            <CardHeader>
              <CardTitle className="text-[#183B4E]">Thông tin tài khoản</CardTitle>
              <CardDescription>Cập nhật thông tin cá nhân và bảo mật</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="full-name">Fullname</FieldLabel>
                  <Input id="full-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="nickname">Nickname</FieldLabel>
                  <Input id="nickname" value={nickName} onChange={(e) => setNickName(e.target.value)} />
                </Field>

                <Field>
                  <div className="flex items-center justify-between">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
                        <BadgeCheck className="h-4 w-4" />
                        Đã xác minh
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-600">Chưa xác minh</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <Button
                      type="button"
                      variant="outline"
                      className="shrink-0 border-[#27548A]/30 text-[#27548A]"
                      onClick={() => setEmailVerified(true)}
                    >
                      <Mail className="h-4 w-4" /> Verify email
                    </Button>
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
                  <div className="flex gap-2">
                    <Phone className="mt-2 h-4 w-4 text-[#27548A]" />
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </Field>

                <Field>
                  <FieldLabel htmlFor="address">Địa chỉ</FieldLabel>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="current-password">Mật khẩu hiện tại</FieldLabel>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="new-password">Mật khẩu mới</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirm-password">Nhập lại mật khẩu mới</FieldLabel>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {!passwordMatch && (
                    <p className="mt-1 text-xs text-red-600">Mật khẩu mới và xác nhận chưa khớp.</p>
                  )}
                </Field>

                <div className="mt-2 flex flex-wrap gap-3">
                  <Button type="submit" className="bg-[#27548A] text-[#F5EEDC] hover:bg-[#1e3f6a]">
                    Lưu thay đổi
                  </Button>
                  <Button type="button" className="bg-[#DDA853] text-[#183B4E] hover:bg-[#c99745]">
                    <Shield className="h-4 w-4" /> Chuyển sang Customer
                  </Button>
                </div>
              </FieldGroup>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
