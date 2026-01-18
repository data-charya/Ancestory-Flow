// App.jsx - Main Application Component
// Ancestry Flow - Family Tree Application with PostgreSQL Backend

import React, { useState, useCallback } from 'react';
import { 
  Header, 
  TreeView, 
  MemberForm, 
  EmptyState, 
  ErrorState, 
  LoadingState 
} from './components';
import { useFamilyMembers } from './hooks';

export default function App() {
  // View state
  const [viewMode, setViewMode] = useState('tree');
  const [isEditing, setIsEditing] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);

  // Family members data and operations
  const { 
    members, 
    loading, 
    error, 
    saveMember, 
    deleteMember, 
    clearAll, 
    loadDemoData 
  } = useFamilyMembers();

  // Form handlers
  const openForm = useCallback((member = null) => {
    setCurrentMember(member);
    setIsEditing(true);
  }, []);

  const closeForm = useCallback(() => {
    setIsEditing(false);
    setCurrentMember(null);
  }, []);

  const handleSave = useCallback(async (formData) => {
    const success = await saveMember(formData, currentMember?.id);
    if (success) {
      closeForm();
    } else {
      alert('Failed to save. Is your server running?');
    }
  }, [saveMember, currentMember, closeForm]);

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Delete this member from your database?')) return;
    const success = await deleteMember(id);
    if (!success) {
      alert('Delete failed.');
    }
  }, [deleteMember]);

  const handleClearAll = useCallback(async () => {
    if (!window.confirm('Delete ALL family members? This cannot be undone.')) return;
    const success = await clearAll();
    if (!success) {
      alert('Failed to clear data.');
    }
  }, [clearAll]);

  const handleLoadDemo = useCallback(async () => {
    const success = await loadDemoData();
    if (!success) {
      alert('Failed to load demo data.');
    }
  }, [loadDemoData]);

  // Loading state
  if (loading) {
    return <LoadingState message="Connecting to Aiven..." />;
  }

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-800">
      {/* Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        onAddMember={() => openForm()}
        onReset={handleClearAll}
        hasMembers={members.length > 0}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-64px)]">
        {error ? (
          <ErrorState message={error} />
        ) : members.length === 0 ? (
          <EmptyState 
            onAddMember={() => openForm()} 
            onLoadDemo={handleLoadDemo} 
          />
        ) : (
          <TreeView
            members={members}
            onEdit={viewMode === 'tree' ? openForm : () => {}}
            presentationMode={viewMode === 'presentation'}
            onExitPresentation={() => setViewMode('tree')}
          />
        )}
      </main>

      {/* Member Form Modal */}
      {isEditing && (
        <MemberForm
          initialData={currentMember}
          allMembers={members}
          onSave={handleSave}
          onCancel={closeForm}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
