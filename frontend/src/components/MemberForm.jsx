// Form modal for creating/editing family members

import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Trash2, Upload, Link, User } from 'lucide-react';

const INITIAL_FORM_STATE = { 
  name: '', 
  relation: '', 
  years: '', 
  imageUrl: '', 
  bio: '', 
  generation: 0, 
  parents: [] 
};

export function MemberForm({ 
  initialData, 
  allMembers, 
  onSave, 
  onCancel, 
  onDelete 
}) {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [imageMode, setImageMode] = useState('url'); // 'url' or 'upload'
  const [previewUrl, setPreviewUrl] = useState('');
  const fileInputRef = useRef(null);
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      const imageUrl = initialData.imageUrl || initialData.image_url || '';
      setFormData({ 
        ...INITIAL_FORM_STATE,
        ...initialData, 
        imageUrl,
        parents: initialData.parents || [] 
      });
      setPreviewUrl(imageUrl);
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'imageUrl') {
      setPreviewUrl(value);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result;
      setFormData(prev => ({ ...prev, imageUrl: base64 }));
      setPreviewUrl(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }));
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const toggleParent = (parentId) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.includes(parentId) 
        ? prev.parents.filter(id => id !== parentId) 
        : [...prev.parents, parentId].slice(0, 2)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (initialData?.id) {
      onDelete(initialData.id);
      onCancel();
    }
  };

  const availableParents = allMembers.filter(m => m.id !== initialData?.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-indigo-50/50">
          <h3 className="font-serif text-lg font-bold text-indigo-900">
            {isEditing ? 'Edit Profile' : 'New Family Member'}
          </h3>
          <button 
            onClick={onCancel}
            className="p-1 hover:bg-indigo-100 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Photo Section */}
          <div className="flex flex-col items-center mb-4">
            {/* Preview */}
            <div className="w-28 h-28 rounded-full border-4 border-stone-200 overflow-hidden bg-stone-100 mb-3 shadow-inner">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={() => setPreviewUrl('')}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <User size={48} />
                </div>
              )}
            </div>

            {/* Image Input Toggle */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  imageMode === 'upload' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Upload size={14} /> Upload
              </button>
              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  imageMode === 'url' 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <Link size={14} /> URL
              </button>
              {previewUrl && (
                <button
                  type="button"
                  onClick={clearImage}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <X size={14} /> Remove
                </button>
              )}
            </div>

            {/* Upload Input */}
            {imageMode === 'upload' && (
              <div className="w-full">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-stone-300 rounded-lg cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
                >
                  <Upload size={18} className="text-stone-400" />
                  <span className="text-sm text-stone-500">Click to upload photo (max 2MB)</span>
                </label>
              </div>
            )}

            {/* URL Input */}
            {imageMode === 'url' && (
              <input 
                type="url" 
                className="w-full border p-2 rounded-lg outline-indigo-500 text-sm" 
                value={formData.imageUrl || ''} 
                onChange={e => handleChange('imageUrl', e.target.value)}
                placeholder="https://example.com/photo.jpg"
              />
            )}
          </div>

          {/* Name & Relation */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-stone-500 block mb-1 uppercase">
                Full Name
              </label>
              <input 
                type="text" 
                required 
                className="w-full border p-2 rounded-lg outline-indigo-500" 
                value={formData.name} 
                onChange={e => handleChange('name', e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1 uppercase">
                Relation
              </label>
              <input 
                type="text" 
                className="w-full border p-2 rounded-lg outline-indigo-500" 
                value={formData.relation} 
                onChange={e => handleChange('relation', e.target.value)} 
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stone-500 block mb-1 uppercase">
                Gen Level
              </label>
              <input 
                type="number" 
                className="w-full border p-2 rounded-lg outline-indigo-500" 
                value={formData.generation} 
                onChange={e => handleChange('generation', parseInt(e.target.value) || 0)} 
              />
            </div>
          </div>

          {/* Parent Selection */}
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1 uppercase">
              Parents (Click to toggle, max 2)
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto border p-2 rounded-lg">
              {availableParents.length === 0 ? (
                <span className="text-xs text-stone-400">No other members available</span>
              ) : (
                availableParents.map(parent => (
                  <button 
                    type="button" 
                    key={parent.id} 
                    onClick={() => toggleParent(parent.id)} 
                    className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                      formData.parents.includes(parent.id) 
                        ? 'bg-indigo-600 text-white border-indigo-600' 
                        : 'bg-stone-50 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    {parent.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4">
            {isEditing ? (
              <button 
                type="button" 
                onClick={handleDelete} 
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Delete
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={onCancel} 
                className="px-4 py-2 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
