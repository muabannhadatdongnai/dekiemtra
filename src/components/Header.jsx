"use client";

import { GraduationCap, LogOut } from "lucide-react";

export default function Header({ user, onLogout }) {
  return (
    <header className="no-print sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <GraduationCap size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none text-slate-900">
              Khoa Dịch Vụ Photocopy
            </p>
            <p className="text-xs text-slate-500">Quốc Lộ 20, Gần Trường Điểu Cải Zalo 0938364681</p>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-600">
              Xin chào, <span className="font-medium">{user.fullName || user.username}</span>
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-1 rounded-md border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50"
            >
              <LogOut size={14} /> Đăng xuất
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
