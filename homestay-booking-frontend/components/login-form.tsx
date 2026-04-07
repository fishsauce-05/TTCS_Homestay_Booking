"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
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

type AuthUser = {
  id: string
  email: string
  fullName: string
  nickname: string
  role: string
}

type LoginResponse = {
  message: string
  accessToken: string
  user: AuthUser
}

const ACCESS_TOKEN_KEY = "auth.accessToken"
const AUTH_USER_KEY = "auth.user"

function joinUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`
}

function extractErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") {
    return fallback
  }

  const message = (payload as { message?: string | string[] }).message
  if (Array.isArray(message)) {
    return message.join(", ")
  }

  if (typeof message === "string" && message.trim().length > 0) {
    return message
  }

  return fallback
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.trim()
      const loginPath = process.env.NEXT_PUBLIC_AUTH_LOGIN_URL || "/api/auth/login"
      const mePath = process.env.NEXT_PUBLIC_AUTH_ME_URL || "/api/auth/me"

      if (!backendUrl) {
        throw new Error("Thieu NEXT_PUBLIC_BACKEND_URL trong file .env.local")
      }

      const loginUrl = joinUrl(backendUrl, loginPath)
      const loginResponse = await fetch(loginUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      })

      const loginPayload = (await loginResponse.json().catch(() => null)) as LoginResponse | null

      if (!loginResponse.ok || !loginPayload) {
        throw new Error(
          extractErrorMessage(loginPayload, "Dang nhap that bai. Vui long thu lai."),
        )
      }

      const accessToken = loginPayload.accessToken
      if (!accessToken) {
        throw new Error("Khong nhan duoc access token tu he thong")
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(loginPayload.user))

      const meUrl = joinUrl(backendUrl, mePath)
      const meResponse = await fetch(meUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (meResponse.ok) {
        const mePayload = (await meResponse.json().catch(() => null)) as AuthUser | null
        if (mePayload) {
          localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mePayload))
        }
      }

      router.push("/home/customer")
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Co loi xay ra. Vui long thu lai.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Đăng nhập vào tài khoản</CardTitle>
          <CardDescription>
            Nhập email của bạn để đăng nhập
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="booking@fishsaucehomestay.vn"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Mật khẩu</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
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
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Dang dang nhap..." : "Đăng nhập"}
                </Button>
                {error && (
                  <FieldDescription className="pt-2 text-center text-red-500">
                    {error}
                  </FieldDescription>
                )}
                <FieldDescription className="text-center">
                  Chưa có tài khoản? <Link href="/register">Đăng ký</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
