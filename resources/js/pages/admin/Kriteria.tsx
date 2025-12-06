import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin-sidebar';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'sonner';

interface Kriteria {
    id: number;
    nama_kriteria: string;
    kode_kriteria: string;
    bobot: number;
    jenis: 'benefit' | 'cost';
}

export function Kriteria() {
    const [kriteria, setKriteria] = useState<Kriteria[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isEdit, setIsEdit] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nama_kriteria: '',
        kode_kriteria: '',
        bobot: '',
        jenis: 'benefit' as 'benefit' | 'cost',
    });

    useEffect(() => {
        fetchKriteria();
    }, []);

    const fetchKriteria = async () => {
        try {
            const data = await api.get('/api/kriteria');
            setKriteria(data);
        } catch (error) {
            console.error('Error fetching kriteria:', error);
            toast.error('Gagal memuat data kriteria');
        }
    };

    const getTotalBobot = () => {
        return kriteria.reduce((total, k) => total + parseFloat(k.bobot.toString()), 0);
    };

    const canAddKriteria = () => {
        const total = getTotalBobot();
        return total < 0.99; // Toleransi untuk floating point
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Kode kriteria akan di-generate otomatis oleh backend
        const payload = {
            nama_kriteria: formData.nama_kriteria,
            bobot: parseFloat(formData.bobot),
            jenis: formData.jenis,
        };

        // Validasi total bobot
        const currentTotal = getTotalBobot();
        const newBobot = payload.bobot;
        const totalAfterAdd = isEdit
            ? currentTotal - (kriteria.find(k => k.id === currentId)?.bobot || 0) + newBobot
            : currentTotal + newBobot;

        if (totalAfterAdd > 1.0) {
            const sisaBobot = 1.0 - currentTotal + (isEdit ? (kriteria.find(k => k.id === currentId)?.bobot || 0) : 0);
            toast.error(`Total bobot tidak boleh melebihi 100%. Sisa bobot: ${(sisaBobot * 100).toFixed(1)}%`);
            return;
        }

        try {
            if (isEdit) {
                await api.put(`/api/kriteria/${currentId}`, payload);
                toast.success('Kriteria berhasil diupdate!');
            } else {
                await api.post('/api/kriteria', payload);
                toast.success('Kriteria berhasil ditambahkan!');
            }
            await fetchKriteria();
            handleCloseDialog();
        } catch (error) {
            console.error('Error saving kriteria:', error);
            toast.error('Gagal menyimpan kriteria: ' + (error as Error).message);
        }
    };

    const handleEdit = (item: Kriteria) => {
        setIsEdit(true);
        setCurrentId(item.id);
        setFormData({
            nama_kriteria: item.nama_kriteria,
            kode_kriteria: item.kode_kriteria,
            bobot: item.bobot.toString(),
            jenis: item.jenis,
        });
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (deleteId) {
            try {
                await api.delete(`/api/kriteria/${deleteId}`);
                toast.success('Kriteria berhasil dihapus!');
                await fetchKriteria();
                setIsDeleteDialogOpen(false);
                setDeleteId(null);
            } catch (error) {
                console.error('Error deleting kriteria:', error);
                toast.error('Gagal menghapus kriteria: ' + (error as Error).message);
            }
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setIsEdit(false);
        setCurrentId(null);
        setFormData({
            nama_kriteria: '',
            kode_kriteria: '',
            bobot: '',
            jenis: 'benefit',
        });
    };

    return (
        <SidebarProvider>
            <AdminSidebar />
            <main className="w-full bg-sidebar p-2">
                <div className="flex flex-col h-full bg-white rounded-lg border-2 border-border overflow-hidden">
                    <header className="flex h-16 shrink-0 items-center gap-2 border-b-2 border-border bg-white px-6">
                        <SidebarTrigger className="-ml-1" />
                        <div className="h-4 w-px bg-border" />
                        <h1 className="text-xl font-heading">Data Kriteria</h1>
                    </header>
                    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto bg-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <p className="text-gray-600 text-sm sm:text-base">Kelola kriteria untuk sistem pendukung keputusan</p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    Total Bobot: {(getTotalBobot() * 100).toFixed(1)}% / 100%
                                    {getTotalBobot() >= 1.0 && (
                                        <span className="text-red-600 font-bold ml-2">✓ Lengkap</span>
                                    )}
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsDialogOpen(true)}
                                disabled={!canAddKriteria()}
                                className="w-full sm:w-auto"
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                <span className="hidden sm:inline">Tambah Kriteria</span>
                                <span className="sm:hidden">Tambah</span>
                            </Button>
                        </div>

                        <div className="rounded-base border-2 border-border bg-white overflow-hidden">
                            <Table>
                                <TableHeader className="bg-orange-500">
                                    <TableRow className="hover:bg-orange-500 border-b-2 border-border">
                                        <TableHead className="text-white font-heading">Kode</TableHead>
                                        <TableHead className="text-white font-heading">Nama Kriteria</TableHead>
                                        <TableHead className="text-white font-heading">Bobot</TableHead>
                                        <TableHead className="text-white font-heading">Jenis</TableHead>
                                        <TableHead className="text-center text-white font-heading">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="bg-white">
                                    {kriteria.map((item) => (
                                        <TableRow key={item.id} className="bg-white hover:bg-gray-50">
                                            <TableCell className="font-mono bg-white">{item.kode_kriteria}</TableCell>
                                            <TableCell className="bg-white">{item.nama_kriteria}</TableCell>
                                            <TableCell className="bg-white">{(item.bobot * 100).toFixed(0)}%</TableCell>
                                            <TableCell className="bg-white">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-base ${item.jenis === 'benefit'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}
                                                >
                                                    {item.jenis}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-center bg-white">
                                                <div className="flex justify-center gap-2">
                                                    <Button
                                                        variant="noShadow"
                                                        size="sm"
                                                        onClick={() => handleEdit(item)}
                                                        className="min-w-[40px]"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                        <span className="ml-2 hidden md:inline">Edit</span>
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
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </main>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isEdit ? 'Edit Kriteria' : 'Tambah Kriteria'}</DialogTitle>
                        <DialogDescription>
                            {isEdit ? 'Ubah data kriteria yang sudah ada' : 'Tambahkan kriteria baru untuk sistem pendukung keputusan'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {isEdit && (
                            <div className="space-y-2">
                                <Label htmlFor="kode">Kode Kriteria</Label>
                                <Input
                                    id="kode"
                                    value={formData.kode_kriteria}
                                    disabled
                                    className="bg-gray-100"
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Kriteria</Label>
                            <Input
                                id="nama"
                                value={formData.nama_kriteria}
                                onChange={(e) =>
                                    setFormData({ ...formData, nama_kriteria: e.target.value })
                                }
                                placeholder="Jarak ke Pusat Kota"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bobot">Bobot (0.00 - 1.00)</Label>
                            <Input
                                id="bobot"
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={formData.bobot}
                                onChange={(e) => setFormData({ ...formData, bobot: e.target.value })}
                                placeholder="0.40"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jenis">Jenis</Label>
                            <Select
                                value={formData.jenis}
                                onValueChange={(value: 'benefit' | 'cost') =>
                                    setFormData({ ...formData, jenis: value })
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="benefit">Benefit</SelectItem>
                                    <SelectItem value="cost">Cost</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="neutral" onClick={handleCloseDialog}>
                                Batal
                            </Button>
                            <Button type="submit">{isEdit ? 'Update' : 'Simpan'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus</AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus kriteria ini? Tindakan ini tidak dapat dibatalkan.
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
