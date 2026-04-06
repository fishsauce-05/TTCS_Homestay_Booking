import Link from "next/link"
import { CircleUserRound } from "lucide-react"

export default function OwnerHomePage() {
  return (
    <div className="min-h-svh bg-[#F5EEDC] text-[#183B4E]">
      <header className="sticky top-0 z-20 border-b border-[#DDA853]/35 bg-[#F5EEDC]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#27548A]">Fishsauce</p>
            <h1 className="text-xl font-semibold md:text-2xl">Home / Owner</h1>
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
                  href="/home/customer"
                  className="block w-full border-y border-[#DDA853]/25 px-4 py-3 text-left text-sm text-[#183B4E] transition hover:bg-[#F5EEDC]"
                >
                  Chuyển sang Customer
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

      <main className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-8 md:px-6 md:py-10 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#DDA853]/45 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[#27548A]">Owner Studio</p>
          <h2 className="mt-2 text-2xl font-semibold">Đăng bài homestay mới</h2>
          <p className="mt-2 text-sm text-[#183B4E]/75">
            Dùng form này để tạo bài đăng phòng/homestay. Khi nối API, dữ liệu sẽ được lưu vào database.
          </p>

          <div className="mt-5 grid gap-3">
            <input
              type="text"
              placeholder="Tên homestay"
              className="rounded-lg border border-[#27548A]/25 bg-[#F5EEDC] px-3 py-2 text-sm outline-none"
            />
            <input
              type="text"
              placeholder="Địa chỉ / khu vực"
              className="rounded-lg border border-[#27548A]/25 bg-[#F5EEDC] px-3 py-2 text-sm outline-none"
            />
            <input
              type="number"
              placeholder="Giá mỗi đêm"
              className="rounded-lg border border-[#27548A]/25 bg-[#F5EEDC] px-3 py-2 text-sm outline-none"
            />
            <textarea
              placeholder="Mô tả ngắn"
              className="min-h-28 rounded-lg border border-[#27548A]/25 bg-[#F5EEDC] px-3 py-2 text-sm outline-none"
            />
            <button
              type="button"
              className="rounded-lg bg-[#27548A] px-4 py-2 text-sm font-medium text-[#F5EEDC] transition hover:bg-[#1e3f6a]"
            >
              Đăng bài
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-[#DDA853]/45 bg-[#183B4E] p-6 text-[#F5EEDC] shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-[#DDA853]">Revenue</p>
          <h2 className="mt-2 text-2xl font-semibold">Thống kê doanh thu</h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-[#F5EEDC]/80">Doanh thu tháng này</p>
              <p className="mt-1 text-xl font-semibold">0đ</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-[#F5EEDC]/80">Đơn đặt phòng</p>
              <p className="mt-1 text-xl font-semibold">0</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-[#F5EEDC]/80">Tỉ lệ lấp đầy</p>
              <p className="mt-1 text-xl font-semibold">0%</p>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-[#F5EEDC]/80">Đánh giá trung bình</p>
              <p className="mt-1 text-xl font-semibold">0.0</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
