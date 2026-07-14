"use client";

import { useState } from "react";
import { Lock, User, Loader2 } from "lucide-react";
import { saveSession } from "@/services/authService";
import { loginRequest } from "@/services/apiClient";

export default function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await loginRequest(username, password);

      // Lưu trạng thái đăng nhập ở localStorage (đơn giản, không cần JWT)
      saveSession(data.user);
      onLoginSuccess(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
      >
        <h1 className="mb-1 text-xl font-semibold text-slate-900">Đăng nhập</h1>
        <p className="mb-6 text-sm text-slate-500">
          Dành cho giáo viên đã được cấp tài khoản. Nếu bạn chưa có tài khoản hãy liên hệ cho tôi qua Zalo 0938 364 681.
        </p>

        <label className="mb-1 block text-sm font-medium text-slate-700">Tên đăng nhập</label>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500">
          <User size={16} className="text-slate-400" />
          <input
            className="w-full text-sm outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="gv.toan01"
            autoComplete="username"
          />
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-700">Mật khẩu</label>
        <div className="mb-4 flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:ring-2 focus-within:ring-brand-500">
          <Lock size={16} className="text-slate-400" />
          <input
            type="password"
            className="w-full text-sm outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-600 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-60"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
