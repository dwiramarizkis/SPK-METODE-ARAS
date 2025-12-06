import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import UserSidebar from '@/components/user-sidebar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, Plus, Trash2, Save } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface Kriteria {
    id: number;
    kode_kriteria: string;
    nama_kriteria: string;
    bobot: number;
    jenis: string;
}

interface Alternatif {
    id: string;
    kode: string;
    nama: string;
    nilai: { [key: number]: number };
}

interface HasilARAS {
    kode: string;
    nama: string;
    utility_degree: number;
    ranking: number;
}

interface ProsesPerhitungan {
    nilaiOptimal: { [key: number]: number };
    matriksNormalisasi: any[];
    nilaiTertimbang: any[];
    S0: number;
}

export function Kalkulasi() {
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [alternatif, setAlternatif] = useState<Alternatif[]>([]);
    const [hasil, setHasil] = useState<HasilARAS[]>([]);
    const [proses, setProses] = useState<ProsesPerhitungan | null>(null);
    const [showHasil, setShowHasil] = useState(false);
    const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
    const [namaKalkulasi, setNamaKalkulasi] = useState('');
    const [isViewingHistory, setIsViewingHistory] = useState(false);
    const [historyName, setHistoryName] = useState('');

    useEffect(() => {
        fetchKriteria();

        // Check if viewing history
        const viewHistory = localStorage.getItem('viewHistory');
        if (viewHistory) {
            try {
                const historyData = JSON.parse(viewHistory);
                loadHistoryData(historyData);
                localStorage.removeItem('viewHistory'); // Clear after loading
            } catch (error) {
                console.error('Error loading history:', error);
            }
        }
    }, []);

    const fetchKriteria = async () => {
        try {
            const data = await api.get('/api/kriteria');
            setKriteria(data);
        } catch (error) {
            toast.error('Gagal memuat kriteria');
        }
    };

    const loadHistoryData = (historyData: any) => {
        // Load kriteria from history (snapshot saat kalkulasi)
        setKriteria(historyData.data_kriteria);

        // Load alternatif
        setAlternatif(historyData.data_alternatif);

        // Load hasil perhitungan
        setHasil(historyData.hasil_perhitungan);

        // Load proses perhitungan
        setProses(historyData.proses_perhitungan);

        // Show hasil
        setShowHasil(true);

        // Set viewing history flag
        setIsViewingHistory(true);
        setHistoryName(historyData.nama_kalkulasi);

        toast.success(`Menampilkan: ${historyData.nama_kalkulasi}`);
    };

    const handleNewCalculation = () => {
        setAlternatif([]);
        setHasil([]);
        setProses(null);
        setShowHasil(false);
        setIsViewingHistory(false);
        setHistoryName('');
        fetchKriteria();
        toast.info('Memulai kalkulasi baru');
    };

    const tambahAlternatif = () => {
        const newId = Date.now().toString();
        const nilaiDefault: { [key: number]: number } = {};
        kriteria.forEach(k => nilaiDefault[k.id] = 0);

        setAlternatif([...alternatif, {
            id: newId,
            kode: `A${alternatif.length + 1}`,
            nama: '',
            nilai: nilaiDefault
        }]);
    };

    const hapusAlternatif = (id: string) => {
        const filtered = alternatif.filter(a => a.id !== id);
        // Reorder kode alternatif setelah hapus
        const reordered = filtered.map((alt, index) => ({
            ...alt,
            kode: `A${index + 1}`
        }));
        setAlternatif(reordered);
    };

    const updateAlternatif = (id: string, field: 'kode' | 'nama', value: string) => {
        setAlternatif(alternatif.map(a =>
            a.id === id ? { ...a, [field]: value } : a
        ));
    };

    const updateNilai = (altId: string, kriteriaId: number, value: string) => {
        setAlternatif(alternatif.map(a =>
            a.id === altId ? {
                ...a,
                nilai: { ...a.nilai, [kriteriaId]: parseFloat(value) || 0 }
            } : a
        ));
    };

    const hitungARAS = () => {
        if (alternatif.length < 2) {
            toast.error('Minimal 2 alternatif diperlukan');
            return;
        }

        if (alternatif.some(a => !a.nama)) {
            toast.error('Nama alternatif tidak boleh kosong');
            return;
        }

        // Step 1: Nilai optimal
        const nilaiOptimal: { [key: number]: number } = {};
        kriteria.forEach(k => {
            const nilaiKriteria = alternatif.map(a => a.nilai[k.id] || 0);
            nilaiOptimal[k.id] = k.jenis === 'benefit'
                ? Math.max(...nilaiKriteria)
                : Math.min(...nilaiKriteria.filter(n => n > 0));
        });

        // Step 2: Normalisasi
        const matriksNormalisasi = alternatif.map(alt => {
            const nilaiNorm: { [key: number]: number } = {};
            kriteria.forEach(k => {
                const nilai = alt.nilai[k.id] || 0;
                if (k.jenis === 'benefit') {
                    const sumKriteria = alternatif.reduce((sum, a) => sum + (a.nilai[k.id] || 0), 0) + nilaiOptimal[k.id];
                    nilaiNorm[k.id] = nilai / sumKriteria;
                } else {
                    const sumInverse = alternatif.reduce((sum, a) => {
                        const val = a.nilai[k.id] || 1;
                        return sum + (1 / val);
                    }, 0) + (1 / nilaiOptimal[k.id]);
                    nilaiNorm[k.id] = (1 / nilai) / sumInverse;
                }
            });
            return { ...alt, nilaiNorm };
        });

        // Step 3: Nilai tertimbang dan hitung S0 (nilai optimal terbobot)
        const S0 = kriteria.reduce((sum, k) => {
            const nilaiOptNorm = k.jenis === 'benefit'
                ? nilaiOptimal[k.id] / (alternatif.reduce((s, a) => s + (a.nilai[k.id] || 0), 0) + nilaiOptimal[k.id])
                : (1 / nilaiOptimal[k.id]) / (alternatif.reduce((s, a) => s + (1 / (a.nilai[k.id] || 1)), 0) + (1 / nilaiOptimal[k.id]));
            return sum + (nilaiOptNorm * k.bobot);
        }, 0);

        const hasilAkhir = matriksNormalisasi.map(alt => {
            // Si = penjumlahan baris (sum nilai terbobot)
            const Si = kriteria.reduce((sum, k) => {
                return sum + (alt.nilaiNorm[k.id] * k.bobot);
            }, 0);

            // Ki = Si / S0
            const Ki = Si / S0;

            return {
                kode: alt.kode,
                nama: alt.nama,
                Si: Si,
                Ki: Ki,
                utility_degree: Ki,
                ranking: 0
            };
        });

        // Step 5: Ranking
        hasilAkhir.sort((a, b) => b.utility_degree - a.utility_degree);
        hasilAkhir.forEach((h, i) => h.ranking = i + 1);

        // Simpan proses
        setProses({
            nilaiOptimal,
            matriksNormalisasi,
            nilaiTertimbang: hasilAkhir,
            S0: S0
        });
        setHasil(hasilAkhir);
        setShowHasil(true);
        toast.success('Kalkulasi berhasil!');
    };

    const handleSaveClick = () => {
        if (!showHasil) {
            toast.error('Lakukan kalkulasi terlebih dahulu');
            return;
        }
        setIsSaveDialogOpen(true);
    };

    const handleSaveHistory = async () => {
        if (!namaKalkulasi.trim()) {
            toast.error('Nama kalkulasi tidak boleh kosong');
            return;
        }

        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');

            await api.post('/api/history', {
                user_id: user.id || 1,
                nama_kalkulasi: namaKalkulasi,
                data_alternatif: alternatif,
                data_kriteria: kriteria,
                hasil_perhitungan: hasil,
                proses_perhitungan: proses,
            });

            toast.success('Kalkulasi berhasil disimpan ke history!');
            setIsSaveDialogOpen(false);
            setNamaKalkulasi('');
        } catch (error) {
            console.error('Error saving history:', error);
            toast.error('Gagal menyimpan history');
        }
    };

    return (
        <SidebarProvider>
            <UserSidebar />
            <main className="w-full bg-sidebar p-2">
                <div className="flex flex-col h-full bg-white rounded-lg border-2 border-border overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-border bg-white px-6">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-xl font-heading">Kalkulasi ARAS</h1>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto bg-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-gray-600 text-sm sm:text-base">Metode Additive Ratio Assessment</p>
                                {isViewingHistory && (
                                    <p className="text-xs text-orange-600 font-semibold mt-1">
                                        📋 Viewing: {historyName}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <Button onClick={tambahAlternatif} variant="neutral" className="flex-1 sm:flex-none" disabled={isViewingHistory}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Tambah Alternatif</span>
                                    <span className="sm:hidden">Tambah</span>
                                </Button>
                                <Button onClick={hitungARAS} className="flex-1 sm:flex-none" disabled={isViewingHistory}>
                                    <Calculator className="mr-2 h-4 w-4" />
                                    Hitung
                                </Button>
                                {showHasil && !isViewingHistory && (
                                    <Button onClick={handleSaveClick} variant="neutral" className="flex-1 sm:flex-none">
                                        <Save className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Simpan</span>
                                        <span className="sm:hidden">Save</span>
                                    </Button>
                                )}
                                {isViewingHistory && (
                                    <Button onClick={handleNewCalculation} variant="neutral" className="flex-1 sm:flex-none">
                                        <Plus className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Kalkulasi Baru</span>
                                        <span className="sm:hidden">Baru</span>
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Input Alternatif */}
                        <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                            <div className="bg-orange-500 p-4 border-b-2 border-border">
                                <h3 className="font-heading text-lg text-white">Data Alternatif</h3>
                            </div>
                            <div className="space-y-4 p-4">
                                {alternatif.map((alt) => (
                                    <div key={alt.id} className="border-2 border-border rounded-base p-4 bg-gray-50">
                                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                                            <div className="w-full sm:w-32">
                                                <Label>Kode</Label>
                                                <Input
                                                    value={alt.kode}
                                                    disabled
                                                    className="bg-gray-100 font-mono font-bold"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label>Nama Alternatif</Label>
                                                <Input
                                                    value={alt.nama}
                                                    onChange={(e) => updateAlternatif(alt.id, 'nama', e.target.value)}
                                                    placeholder="Nama lokasi/perumahan"
                                                />
                                            </div>
                                            <div className="flex items-end">
                                                <Button
                                                    variant="noShadow"
                                                    size="sm"
                                                    onClick={() => hapusAlternatif(alt.id)}
                                                    className="w-full sm:w-auto"
                                                >
                                                    <Trash2 className="h-4 w-4 sm:mr-0 mr-2" />
                                                    <span className="sm:hidden">Hapus</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {kriteria.map((k) => (
                                                <div key={k.id}>
                                                    <Label className="text-xs">{k.nama_kriteria}</Label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={alt.nilai[k.id] || ''}
                                                        onChange={(e) => updateNilai(alt.id, k.id, e.target.value)}
                                                        placeholder="0"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                                {alternatif.length === 0 && (
                                    <p className="text-center text-gray-500 py-8">
                                        Belum ada alternatif. Klik "Tambah Alternatif" untuk mulai.
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Proses Perhitungan */}
                        {showHasil && proses && (
                            <>
                                {/* Step 1: Alternatif Ideal */}
                                <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                                    <div className="bg-blue-500 p-4 border-b-2 border-border">
                                        <h3 className="font-heading text-lg text-white">Step 1: Menentukan Alternatif Ideal (Nilai Optimal)</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-gray-200">
                                                <TableRow>
                                                    <TableHead className="font-heading">Alternatif</TableHead>
                                                    {kriteria.map(k => (
                                                        <TableHead key={k.id} className="font-heading">{k.kode_kriteria}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {alternatif.map(alt => (
                                                    <TableRow key={alt.id}>
                                                        <TableCell className="font-mono font-bold">{alt.kode}</TableCell>
                                                        {kriteria.map(k => (
                                                            <TableCell key={k.id}>{alt.nilai[k.id]}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                                <TableRow className="bg-yellow-100">
                                                    <TableCell className="font-bold">Optimal</TableCell>
                                                    {kriteria.map(k => (
                                                        <TableCell key={k.id} className="font-bold">{proses.nilaiOptimal[k.id]}</TableCell>
                                                    ))}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Step 2: Normalisasi */}
                                <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                                    <div className="bg-purple-500 p-4 border-b-2 border-border">
                                        <h3 className="font-heading text-lg text-white">Step 2: Normalisasi Matriks Keputusan (Cost & Benefit)</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-gray-200">
                                                <TableRow>
                                                    <TableHead className="font-heading">Alternatif</TableHead>
                                                    {kriteria.map(k => (
                                                        <TableHead key={k.id} className="font-heading">{k.kode_kriteria}</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {proses.matriksNormalisasi.map(alt => (
                                                    <TableRow key={alt.id}>
                                                        <TableCell className="font-mono font-bold">{alt.kode}</TableCell>
                                                        {kriteria.map(k => (
                                                            <TableCell key={k.id}>{alt.nilaiNorm[k.id].toFixed(4)}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                                <TableRow className="bg-yellow-100">
                                                    <TableCell className="font-bold">Optimal</TableCell>
                                                    {kriteria.map(k => {
                                                        const nilaiOptNorm = k.jenis === 'benefit'
                                                            ? proses.nilaiOptimal[k.id] / (alternatif.reduce((s, a) => s + (a.nilai[k.id] || 0), 0) + proses.nilaiOptimal[k.id])
                                                            : (1 / proses.nilaiOptimal[k.id]) / (alternatif.reduce((s, a) => s + (1 / (a.nilai[k.id] || 1)), 0) + (1 / proses.nilaiOptimal[k.id]));
                                                        return (
                                                            <TableCell key={k.id} className="font-bold">
                                                                {nilaiOptNorm.toFixed(4)}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Step 3: Matriks Normalisasi Terbobot */}
                                <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                                    <div className="bg-indigo-500 p-4 border-b-2 border-border">
                                        <h3 className="font-heading text-lg text-white">Step 3: Matriks Normalisasi Terbobot</h3>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader className="bg-gray-200">
                                                <TableRow>
                                                    <TableHead className="font-heading">Alternatif</TableHead>
                                                    {kriteria.map(k => (
                                                        <TableHead key={k.id} className="font-heading">{k.kode_kriteria} (w={k.bobot})</TableHead>
                                                    ))}
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {proses.matriksNormalisasi.map(alt => (
                                                    <TableRow key={alt.id}>
                                                        <TableCell className="font-mono font-bold">{alt.kode}</TableCell>
                                                        {kriteria.map(k => (
                                                            <TableCell key={k.id}>{(alt.nilaiNorm[k.id] * k.bobot).toFixed(4)}</TableCell>
                                                        ))}
                                                    </TableRow>
                                                ))}
                                                <TableRow className="bg-yellow-100">
                                                    <TableCell className="font-bold">Optimal</TableCell>
                                                    {kriteria.map(k => {
                                                        const nilaiOptNorm = k.jenis === 'benefit'
                                                            ? proses.nilaiOptimal[k.id] / (alternatif.reduce((s, a) => s + (a.nilai[k.id] || 0), 0) + proses.nilaiOptimal[k.id])
                                                            : (1 / proses.nilaiOptimal[k.id]) / (alternatif.reduce((s, a) => s + (1 / (a.nilai[k.id] || 1)), 0) + (1 / proses.nilaiOptimal[k.id]));
                                                        return (
                                                            <TableCell key={k.id} className="font-bold">
                                                                {(nilaiOptNorm * k.bobot).toFixed(4)}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>

                                {/* Step 4: Fungsi Kegunaan */}
                                <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                                    <div className="bg-pink-500 p-4 border-b-2 border-border">
                                        <h3 className="font-heading text-lg text-white">Step 4: Perhitungan Fungsi Kegunaan (Si) dan Derajat Kegunaan (Ki)</h3>
                                        <p className="text-sm text-white mt-2">S0 (Nilai Optimal) = {proses.S0.toFixed(4)}</p>
                                    </div>
                                    <Table>
                                        <TableHeader className="bg-gray-200">
                                            <TableRow>
                                                <TableHead className="font-heading">Alternatif</TableHead>
                                                <TableHead className="font-heading">Si (Σ Nilai Terbobot)</TableHead>
                                                <TableHead className="font-heading">Ki = Si / S0</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {proses.nilaiTertimbang.map(h => (
                                                <TableRow key={h.kode}>
                                                    <TableCell className="font-mono font-bold">{h.kode}</TableCell>
                                                    <TableCell>{h.Si.toFixed(4)}</TableCell>
                                                    <TableCell className="font-bold">{h.Ki.toFixed(4)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {/* Hasil */}
                        {showHasil && (
                            <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                                <div className="bg-green-500 p-4 border-b-2 border-border">
                                    <h3 className="font-heading text-lg text-white">Hasil Perangkingan</h3>
                                </div>
                                <Table>
                                    <TableHeader className="bg-orange-500">
                                        <TableRow className="hover:bg-orange-500 border-b-2 border-border">
                                            <TableHead className="text-white font-heading">Rank</TableHead>
                                            <TableHead className="text-white font-heading">Kode</TableHead>
                                            <TableHead className="text-white font-heading">Nama Alternatif</TableHead>
                                            <TableHead className="text-white font-heading">Hasil (Ki)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="bg-white">
                                        {hasil.map((h) => (
                                            <TableRow key={h.kode} className={`bg-white hover:bg-gray-50 ${h.ranking === 1 ? 'bg-green-50' : ''}`}>
                                                <TableCell className="font-mono bg-white font-bold text-lg">
                                                    {h.ranking === 1 ? '🏆' : h.ranking}
                                                </TableCell>
                                                <TableCell className="font-mono bg-white">{h.kode}</TableCell>
                                                <TableCell className="bg-white font-semibold">{h.nama}</TableCell>
                                                <TableCell className="bg-white font-bold">{h.utility_degree.toFixed(4)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Save Dialog */}
            <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Simpan Kalkulasi ke History</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kalkulasi</Label>
                            <Input
                                id="nama"
                                value={namaKalkulasi}
                                onChange={(e) => setNamaKalkulasi(e.target.value)}
                                placeholder="Contoh: Pemilihan Lokasi Perumahan Desember 2025"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="neutral" onClick={() => setIsSaveDialogOpen(false)}>
                            Batal
                        </Button>
                        <Button type="button" onClick={handleSaveHistory}>
                            Simpan
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SidebarProvider>
    );
}
