'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Package, Car, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Accessory } from '@/types';
import { fetchAccessories } from '@/lib/accessories';

export default function CatalogPage() {
    const [showFilters, setShowFilters] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [accessories, setAccessories] = useState<Accessory[]>([]);
    const [filteredAccessories, setFilteredAccessories] = useState<Accessory[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadAccessories();
    }, []);

    const loadAccessories = async () => {
        try {
            setLoading(true);
            const data = await fetchAccessories();
            setAccessories(data);
            setFilteredAccessories(data);
        } catch (error) {
            console.error('Error fetching accessories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const term = searchTerm.toLowerCase();
        const filtered = accessories.filter(
            (a: Accessory) =>
                a.name.toLowerCase().includes(term) ||
                a.compatible_vehicles.some((v) => v.toLowerCase().includes(term))
        );
        setFilteredAccessories(filtered);
    };

    const handleAvailabilityFilter = (availability: string) => {
        if (!availability) {
            setFilteredAccessories(accessories);
            return;
        }
        setFilteredAccessories(accessories.filter((a) => a.availability === availability));
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Search Header */}
            <div className="sticky top-16 z-40">
                <div className="container mx-auto px-4 py-4">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <Input
                                type="text"
                                placeholder="Buscar por nombre o vehículo compatible..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            Filtros
                        </Button>
                        <Button type="submit">Buscar</Button>
                    </form>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Disponibilidad</label>
                                    <select
                                        className="w-full p-2 border rounded-md"
                                        onChange={(e) => handleAvailabilityFilter(e.target.value)}
                                    >
                                        <option value="">Todas</option>
                                        <option value="immediate">Entrega inmediata</option>
                                        <option value="on_order">Por encargo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Precio Máximo</label>
                                    <select className="w-full p-2 border rounded-md">
                                        <option value="">Cualquiera</option>
                                        <option value="50000">$50,000</option>
                                        <option value="100000">$100,000</option>
                                        <option value="200000">$200,000</option>
                                        <option value="500000">$500,000</option>
                                        <option value="1000000">$1,000,000</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Results */}

            <div className="container mx-auto px-4 py-8">
                <section className="bg-[#d60000ff] bg-center bg-cover min-h-50 flex items-center justify-center mb-4">
                    <img src="/srp_tuning.png" alt="logo srp" className="w-80 h-auto" />
                </section>
                <div className="mb-4">
                    <h1 className="text-2xl font-bold">Catálogo de Accesorios</h1>
                    <p className="text-gray-600">{filteredAccessories.length} accesorios encontrados</p>
                </div>
                {loading ? (
                    <div className="text-center py-[5rem]">
                        <div className="inline-block w-[50px] h-[50px] border-4 border-[var(--color-gold)] border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-[var(--color-gold)] text-lg mt-4">Cargando accesorios...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredAccessories.map((accessory) => (
                            <Card key={accessory.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative">
                                    {accessory.image_url ? (
                                        <img
                                            src={accessory.image_url}
                                            alt={accessory.name}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-800 flex items-center justify-center">
                                            <Package className="h-16 w-16 text-gray-600" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                        ${accessory.price.toLocaleString()}
                                    </div>
                                    <div
                                        className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-semibold ${accessory.availability === 'immediate'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-orange-600 text-white'
                                            }`}
                                    >
                                        {accessory.availability === 'immediate' ? 'Entrega inmediata' : 'Por encargo'}
                                    </div>
                                </div>
                                <CardContent className="p-4">
                                    <h3 className="text-lg font-semibold mb-2">{accessory.name}</h3>
                                    {accessory.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{accessory.description}</p>
                                    )}
                                    <div className="flex items-start text-sm text-gray-600 border-t pt-3">
                                        <Car className="h-4 w-4 mr-1 mt-0.5 shrink-0" />
                                        <span>
                                            Compatible con:{' '}
                                            {accessory.compatible_vehicles.slice(0, 3).join(', ')}
                                            {accessory.compatible_vehicles.length > 3 &&
                                                ` +${accessory.compatible_vehicles.length - 3} más`}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {!loading && filteredAccessories.length === 0 && (
                    <div className="text-center py-[5rem]">
                        <p className="text-gray-600 text-lg">
                            No se encontraron accesorios con los filtros seleccionados.
                        </p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => {
                                setSearchTerm('');
                                setFilteredAccessories(accessories);
                            }}
                        >
                            Limpiar filtros
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
