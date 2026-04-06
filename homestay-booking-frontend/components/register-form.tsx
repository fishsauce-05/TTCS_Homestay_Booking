"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const passwordsMatch = password === confirmPassword && password !== ""

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Tạo tài khoản</CardTitle>
        <CardDescription>
          Nhập thông tin bên dưới để đăng ký tài khoản
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="full-name">Tên đầy đủ</FieldLabel>
              <Input id="full-name" type="text" placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="nickname">Biệt danh</FieldLabel>
              <Input id="nickname" type="text" placeholder="johnny" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                placeholder="booking@fishsaucehomestay.vn"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Nhập lại mật khẩu
              </FieldLabel>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {password && confirmPassword && !passwordsMatch && (
                <FieldDescription className="text-red-500">
                  Mật khẩu không khớp. Vui lòng kiểm tra lại.
                </FieldDescription>
              )}
              {passwordsMatch && password && (
                <FieldDescription className="text-green-500">
                  Mật khẩu khớp!
                </FieldDescription>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="phone">Số điện thoại</FieldLabel>
              <Input id="phone" type="tel" placeholder="(+84) 847-318-696" required />
            </Field>
            <FieldGroup>
              <Field>
                <Button
                  type="submit"
                  disabled={password && confirmPassword ? !passwordsMatch : false}
                >
                  Đăng ký
                </Button>
                <FieldDescription className="px-6 text-center">
                  Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
