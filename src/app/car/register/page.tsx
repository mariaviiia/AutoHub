'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Car, Upload, Plus, X, CheckCircle, ArrowRight, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';

export default function CarRegisterPage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    mileage_km: '',
    improvements: '',
    traction: '',
    plate_last_digit: '',
    comments: '',
    owner_name: '',
    owner_phone: '',
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (validFiles.length === 0) {
      alert('Por favor selecciona solo archivos de imagen.');
      return;
    }

    setImageFiles([...imageFiles, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const uploadImages = async (vehicleId: number): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${vehicleId}/${Date.now()}-${i}.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vehicle-images')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        continue;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('vehicle-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Insert vehicle
      const { data: vehicleData, error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          make: formData.make,
          model: formData.model,
          year: parseInt(formData.year),
          mileage_km: parseInt(formData.mileage_km),
          improvements: formData.improvements,
          traction: formData.traction,
          plate_last_digit: formData.plate_last_digit ? parseInt(formData.plate_last_digit) : null,
          description: formData.comments,
          status: 'pending', // Pending admin approval
          condition: 'used',
          fuel_type: 'Gasolina',
          transmission: 'Automática',
          color: 'No especificado',
        })
        .select()
        .single();

      if (vehicleError) throw vehicleError;

      // Upload images to Supabase Storage
      let uploadedImageUrls: string[] = [];
      if (imageFiles.length > 0 && vehicleData) {
        setUploadingImages(true);
        uploadedImageUrls = await uploadImages(vehicleData.id);
        setUploadingImages(false);

        // Insert image URLs to database
        if (uploadedImageUrls.length > 0) {
          const imageInserts = uploadedImageUrls.map((url, index) => ({
            vehicle_id: vehicleData.id,
            url: url,
            order_index: index,
            is_primary: index === 0,
          }));

          const { error: imagesError } = await supabase
            .from('vehicle_images')
            .insert(imageInserts);

          if (imagesError) throw imagesError;
        }
      }

      // Insert owner contact information
      if (vehicleData && formData.owner_name && formData.owner_phone) {
        const { error: contactError } = await supabase
          .from('vehicle_owner_contacts')
          .insert({
            vehicle_id: vehicleData.id,
            owner_name: formData.owner_name,
            owner_phone: formData.owner_phone,
          });

        if (contactError) throw contactError;
      }

      setSuccess(true);
    } catch (error) {
      console.error('Error registering vehicle:', error);
      alert('Error al registrar el vehículo. Por favor intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">¡Vehículo Registrado!</h2>
            <p className="text-gray-400 mb-6">
              Tu vehículo ha sido registrado exitosamente y está pendiente de aprobación por el administrador.
            </p>
            <Link href="/">
              <Button className="w-full">
                Volver al inicio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-white hover:text-gray-300">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <Car className="h-16 w-16 text-[var(--color-gold)] mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2 text-white font-mono italic uppercase">
              Registra tu Vehículo
            </h1>
            <p className="text-gray-400">
              Completa el formulario para vender tu vehículo. Los datos de contacto solo serán visibles para el administrador.
            </p>
          </div>

          <Card>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Vehicle Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Información del Vehículo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Marca *
                      </label>
                      <Input
                        type="text"
                        value={formData.make}
                        onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                        placeholder="Ej: Toyota"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Modelo *
                      </label>
                      <Input
                        type="text"
                        value={formData.model}
                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                        placeholder="Ej: Corolla"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Año *
                      </label>
                      <Input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder="Ej: 2020"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Kilometraje (km) *
                      </label>
                      <Input
                        type="number"
                        value={formData.mileage_km}
                        onChange={(e) => setFormData({ ...formData, mileage_km: e.target.value })}
                        placeholder="Ej: 50000"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Tracción *
                      </label>
                      <select
                        value={formData.traction}
                        onChange={(e) => setFormData({ ...formData, traction: e.target.value })}
                        required
                        className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                      >
                        <option value="">Seleccionar</option>
                        <option value="FWD">Delantera (FWD)</option>
                        <option value="RWD">Trasera (RWD)</option>
                        <option value="AWD">4x4 (AWD)</option>
                        <option value="4WD">4x4 (4WD)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Último dígito de placa *
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max="9"
                        value={formData.plate_last_digit}
                        onChange={(e) => setFormData({ ...formData, plate_last_digit: e.target.value })}
                        placeholder="Ej: 5"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Mejoras / Modificaciones
                    </label>
                    <textarea
                      value={formData.improvements}
                      onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                      placeholder="Describe las mejoras o modificaciones del vehículo..."
                      rows={3}
                      className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Comentarios (opcional)
                    </label>
                    <textarea
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Cualquier información adicional sobre el vehículo..."
                      rows={3}
                      className="w-full p-2 border border-gray-700 rounded-md bg-gray-900 text-white"
                    />
                  </div>
                </div>

                {/* Images */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Fotos del Vehículo
                  </h3>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-gray-600 transition-colors">                    <input
                        type="file"
                        id="image-upload"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-gray-300 font-medium">
                          Haz clic para seleccionar fotos
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          PNG, JPG, GIF hasta 10MB
                        </p>
                      </label>
                    </div>
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative">
                            <img
                              src={preview}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                            {index === 0 && (
                              <span className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                                Principal
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Owner Contact Information */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Información de Contacto
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Esta información solo será visible para el administrador para contactarte.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Nombre del dueño *
                      </label>
                      <Input
                        type="text"
                        value={formData.owner_name}
                        onChange={(e) => setFormData({ ...formData, owner_name: e.target.value })}
                        placeholder="Tu nombre completo"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">
                        Celular *
                      </label>
                      <Input
                        type="tel"
                        value={formData.owner_phone}
                        onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                        placeholder="+57 300 123 4567"
                        required
                        className="bg-gray-900 border-gray-700 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading || uploadingImages}
                  className="w-full bg-gold text-black hover:bg-gold-dark font-bold font-mono p-6"
                >
                  {uploadingImages ? 'Subiendo fotos...' : isLoading ? 'Registrando...' : 'Registrar Vehículo'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
