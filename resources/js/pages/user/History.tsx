import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import UserSidebar from '@/components/user-sidebar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Trash2, History as HistoryIcon } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface HistoryItem {
    id: number;
    nama_kalkulasi: string;
    created_at: string;
    hasil_perhitungan: any[];
    proses_perhitungan: any;
    data_alternatif: any[];
    data_kriteria: any[];
}

export function History() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const data = await api.get('/api/history');
            setHistory(data);
        } catch (error) {
            toast.error('Gagal memuat history');
        }
    };

    const handleView = (item: HistoryItem) => {
        // Simpan history data ke localStorage
        localStorage.setItem('viewHistory', JSON.stringify(item));
        // Redirect ke halaman kalkulasi
        window.location.hash = 'kalkulasi';
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await api.delete(`/api/history/${deleteId}`);
                toast.success('History berhasil dihapus!');
                fetchHistory();
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            } catch (error) {
                toast.error('Gagal menghapus history');
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <SidebarProvider>
            <UserSidebar />
            <main className="w-full bg-sidebar p-2">
                <div className="flex flex-col h-full bg-white rounded-lg border-2 border-border overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-border bg-white px-6">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-xl font-heading">History Kalkulasi</h1>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto bg-gray-50">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600 text-sm sm:text-base">Riwayat perhitungan ARAS</p>
                        </div>

                        <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-orange-500">
                                    <TableRow className="hover:bg-orange-500 border-b-2 border-border">
                                        <TableHead className="text-white font-heading">Nama Kalkulasi</TableHead>
                                        <TableHead className="text-white font-heading">Tanggal</TableHead>
                                        <TableHead className="text-white font-heading">Jumlah Alternatif</TableHead>
                                        <TableHead className="text-center text-white font-heading">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {history.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                <HistoryIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                                Belum ada history kalkulasi
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        history.map((item) => (
                                            <TableRow key={item.id} className="bg-white hover:bg-gray-50">
                                                <TableCell className="font-semibold bg-white">{item.nama_kalkulasi}</TableCell>
                                                <TableCell className="bg-white">{formatDate(item.created_at)}</TableCell>
                                                <TableCell className="bg-white">{item.data_alternatif.length} alternatif</TableCell>
                                                <TableCell className="text-center bg-white">
                                                    <div className="flex justify-center gap-2">
                                                        <Button
                                                            variant="noShadow"
                                                            size="sm"
                                                            onClick={() => handleView(item)}
                                                            className="min-w-[40px]"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span className="ml-2 hidden md:inline">Lihat</span>
                                                        </Button>
                                                        <Button
                                                            variant="noShadow"
                                                            size="sm"
                                                            onClick={() => handleDeleteClick(item.id)}
                                                            className="min-w-[40px]"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            <span className="ml-2 hidden md:inline">Hapus</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </main>

            {/* Delete Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus history ini? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm}>Hapus</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </SidebarProvider>
    );
}
