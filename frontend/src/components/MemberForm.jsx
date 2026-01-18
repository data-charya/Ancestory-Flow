// Form modal for creating/editing family members

import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';

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
  const isEditing = Boolean(initialData?.id);

  useEffect(() => {
    if (initialData) {
      setFormData({ 
        ...INITIAL_FORM_STATE,
        ...initialData, 
        parents: initialData.parents || [] 
      });
    }
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleParent = (parentId) => {
    setFormData(prev => ({
      ...prev,
      parents: prev.parents.includes(parentId) 
        ? prev.parents.filter(id => id !== parentId) 
        : [...prev.parents, parentId].slice(0, 2) // Max 2 parents
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

  // Filter out current member from parent selection
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

          {/* Image URL */}
          <div>
            <label className="text-xs font-bold text-stone-500 block mb-1 uppercase">
              Image URL
            </label>
            <input 
              type="url" 
              className="w-full border p-2 rounded-lg outline-indigo-500" 
              value={formData.imageUrl || ''} 
              onChange={e => handleChange('imageUrl', e.target.value)}
              placeholder="https://example.com/photo.jpg"
            />
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

