import Link from "next/link"
import { CircleUserRound, MapPin, Search } from "lucide-react"

const popularAreas = ["Hà Đông", "Cầu Giấy", "Thanh Xuân", "Hoàng Mai", "Long Biên"]

export default function CustomerHomePage() {
  return (
    <div className="min-h-svh bg-[#F5EEDC] text-[#183B4E]">
      <header className="sticky top-0 z-20 border-b border-[#DDA853]/35 bg-[#F5EEDC]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#27548A]">Fishsauce</p>
            <h1 className="text-xl font-semibold md:text-2xl">Home / Customer</h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-sm font-medium text-[#27548A]">
              Hi, <span className="font-semibold">Admin</span>
            </p>

            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center justify-center rounded-full border border-[#27548A]/40 p-2 text-[#27548A] transition hover:bg-[#27548A] hover:text-[#F5EEDC]">
                <CircleUserRound className="h-5 w-5" />
              </summary>

              <div className="absolute right-0 z-30 mt-2 min-w-56 overflow-hidden rounded-xl border border-[#DDA853]/40 bg-white shadow-lg">
                <Link
                  href="/profile"
                  className="block w-full px-4 py-3 text-left text-sm text-[#183B4E] transition hover:bg-[#F5EEDC]"
                >
                  Chỉnh sửa thông tin cá nhân
                </Link>
                <Link
                  href="/home/owner"
                  className="block w-full border-y border-[#DDA853]/25 px-4 py-3 text-left text-sm text-[#183B4E] transition hover:bg-[#F5EEDC]"
                >
                  Chuyển sang Owner
                </Link>
                <Link
                  href="/home/admin"
                  className="block w-full border-b border-[#DDA853]/25 px-4 py-3 text-left text-sm text-[#183B4E] transition hover:bg-[#F5EEDC]"
                >
                  Vào trang Admin
                </Link>
                <Link
                  href="/"
                  className="block px-4 py-3 text-sm font-medium text-[#B23A48] transition hover:bg-[#FDEDEF]"
                >
                  Đăng xuất
                </Link>
              </div>
            </details>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="overflow-hidden rounded-3xl border border-[#DDA853]/45 bg-[#183B4E] text-[#F5EEDC] shadow-xl">
          <div className="grid gap-6 p-6 md:grid-cols-[1.2fr_1fr] md:p-10">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.2em] text-[#DDA853]">Customer Dashboard</p>
              <h2 className="text-3xl font-semibold leading-tight md:text-4xl">
                Đặt homestay nhanh theo khu vực bạn muốn
              </h2>
              <p className="max-w-xl text-sm text-[#F5EEDC]/85 md:text-base">
                Đây là trang dành cho khách hàng. Bạn có thể tìm kiếm khu vực, xem danh sách
                và tiến hành đặt phòng.
              </p>

              <form className="mt-4 grid w-full max-w-3xl gap-2 rounded-xl bg-[#F5EEDC] p-3 text-[#183B4E] md:grid-cols-[1fr_auto]">
                <label className="flex items-center gap-2 rounded-lg border border-[#27548A]/20 bg-white px-3 py-2">
                  <MapPin className="h-4 w-4 text-[#27548A]" />
                  <input
                    type="search"
                    placeholder="Khu vực (Hồ Tây, Hoàn Kiếm...)"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#183B4E]/60"
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27548A] px-4 py-2 text-sm font-medium text-[#F5EEDC] transition hover:bg-[#1e3f6a]"
                >
                  <Search className="h-4 w-4" />
                  Tìm phòng
                </button>
              </form>
            </div>

            <div
              className="min-h-56 rounded-2xl border border-[#DDA853]/40 bg-cover bg-center"
              style={{ backgroundImage: "url('/background.jpg')" }}
            />
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-[#DDA853]/40 bg-white/70 p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#27548A]">
            Khu vực đặt nhiều
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularAreas.map((area) => (
              <button
                key={area}
                className="rounded-full border border-[#27548A]/35 bg-[#F5EEDC] px-4 py-2 text-sm transition hover:border-[#27548A] hover:bg-[#27548A] hover:text-[#F5EEDC]"
                type="button"
              >
                {area}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center gap-2 text-[#27548A]">
            <MapPin className="h-4 w-4" />
            <h3 className="text-lg font-semibold">Danh sách homestay</h3>
          </div>

          <div className="rounded-2xl border border-dashed border-[#27548A]/40 bg-white/60 px-6 py-10 text-center">
            <p className="text-base font-medium text-[#183B4E]">Chưa có dữ liệu homestay</p>
            <p className="mt-2 text-sm text-[#183B4E]/70">
              Khu vực này sẽ render dữ liệu từ API database khi bạn tích hợp backend.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
