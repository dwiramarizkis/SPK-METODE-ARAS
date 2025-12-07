import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import UserSidebar from '@/components/user-sidebar';

export function Dashboard() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userName = user.username || 'User';

    return (
        <SidebarProvider>
            <UserSidebar />
            <main className="w-full bg-sidebar p-2">
                <div className="flex flex-col h-full bg-white rounded-lg border-2 border-border overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-border bg-white px-6">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-xl font-heading">User Dashboard</h1>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto bg-gray-50">
                        {/* Welcome Card */}
                        <div className="rounded-base border-2 border-border bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <h2 className="text-2xl font-heading">Welcome, {userName}!</h2>
                        </div>

                        {/* ARAS Method Info Card */}
                        <div className="rounded-base border-2 border-border bg-white p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-heading mb-2 text-orange-600">Metode ARAS (Additive Ratio Assessment)</h3>
                                    <p className="text-gray-600 text-sm">
                                        Metode ARAS adalah teknik pengambilan keputusan multi-kriteria yang menentukan peringkat alternatif
                                        berdasarkan rasio utilitas terhadap alternatif optimal.
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-l-4 border-blue-500 pl-4">
                                        <h4 className="font-heading text-sm mb-2">Step 1: Menentukan Alternatif Ideal (Nilai Optimal)</h4>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
                                            <p className="mb-1">Benefit: x₀ⱼ = max(xᵢⱼ)</p>
                                            <p>Cost: x₀ⱼ = min(xᵢⱼ)</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Menentukan nilai terbaik untuk setiap kriteria</p>
                                    </div>

                                    <div className="border-l-4 border-purple-500 pl-4">
                                        <h4 className="font-heading text-sm mb-2">Step 2: Normalisasi Matriks Keputusan</h4>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
                                            <p className="mb-1">Benefit: x̄ᵢⱼ = xᵢⱼ / Σxᵢⱼ</p>
                                            <p>Cost: x̄ᵢⱼ = (1/xᵢⱼ) / Σ(1/xᵢⱼ)</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Normalisasi nilai agar dapat dibandingkan</p>
                                    </div>

                                    <div className="border-l-4 border-indigo-500 pl-4">
                                        <h4 className="font-heading text-sm mb-2">Step 3: Matriks Normalisasi Terbobot</h4>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
                                            <p>x̂ᵢⱼ = x̄ᵢⱼ × wⱼ</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Mengalikan nilai normalisasi dengan bobot kriteria</p>
                                    </div>

                                    <div className="border-l-4 border-pink-500 pl-4">
                                        <h4 className="font-heading text-sm mb-2">Step 4: Fungsi Kegunaan (Sᵢ) dan Derajat Kegunaan (Kᵢ)</h4>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
                                            <p className="mb-1">Sᵢ = Σx̂ᵢⱼ (penjumlahan nilai terbobot)</p>
                                            <p className="mb-1">S₀ = Σx̂₀ⱼ (nilai optimal terbobot)</p>
                                            <p>Kᵢ = Sᵢ / S₀</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Menghitung rasio utilitas setiap alternatif</p>
                                    </div>

                                    <div className="border-l-4 border-green-500 pl-4">
                                        <h4 className="font-heading text-sm mb-2">Step 5: Perangkingan</h4>
                                        <div className="bg-gray-50 p-3 rounded border border-gray-200 font-mono text-xs">
                                            <p>Ranking berdasarkan nilai Kᵢ tertinggi</p>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-2">Alternatif dengan Kᵢ terbesar adalah yang terbaik</p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 border-2 border-orange-200 rounded-base p-4">
                                    <p className="text-sm text-gray-700">
                                        <span className="font-bold">Catatan:</span> Nilai Kᵢ berkisar antara 0 hingga 1.
                                        Semakin tinggi nilai Kᵢ, semakin baik alternatif tersebut.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </SidebarProvider>
    );
}
