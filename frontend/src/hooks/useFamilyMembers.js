// Custom hook for managing family members state and operations

import { useState, useEffect, useCallback } from 'react';
import * as membersApi from '../api/members';
import { DEMO_MEMBERS, DEMO_RELATIONSHIPS } from '../data/demoData';

export function useFamilyMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const data = await membersApi.fetchMembers();
      setMembers(data);
      setError(null);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Backend server not detected. Please run your Node.js server to connect to Aiven.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveMember = useCallback(async (memberData, existingId = null) => {
    try {
      if (existingId) {
        await membersApi.updateMember(existingId, memberData);
      } else {
        await membersApi.createMember(memberData);
      }
      await refresh();
      return true;
    } catch (err) {
      console.error('Save error:', err);
      return false;
    }
  }, [refresh]);

  const deleteMember = useCallback(async (id) => {
    try {
      await membersApi.deleteMember(id);
      await refresh();
      return true;
    } catch (err) {
      console.error('Delete error:', err);
      return false;
    }
  }, [refresh]);

  const clearAll = useCallback(async () => {
    try {
      setLoading(true);
      await membersApi.deleteAllMembers(members);
      await refresh();
      return true;
    } catch (err) {
      console.error('Clear error:', err);
      setLoading(false);
      return false;
    }
  }, [members, refresh]);

  const loadDemoData = useCallback(async () => {
    setLoading(true);
    try {
      // Step 1: Create all members
      const createdMembers = [];
      for (const member of DEMO_MEMBERS) {
        const created = await membersApi.createMember(member);
        createdMembers.push(created);
      }

      // Step 2: Set up parent relationships
      const findByName = (name) => createdMembers.find(m => m.name === name);

      for (const [childName, parentNames] of Object.entries(DEMO_RELATIONSHIPS)) {
        const child = findByName(childName);
        const parents = parentNames.map(findByName).filter(Boolean);
        
        if (child && parents.length > 0) {
          await membersApi.updateMember(child.id, {
            ...child,
            parents: parents.map(p => p.id),
          });
        }
      }

      await refresh();
      return true;
    } catch (err) {
      console.error('Demo data error:', err);
      setLoading(false);
      return false;
    }
  }, [refresh]);

  return {
    members,
    loading,
    error,
    refresh,
    saveMember,
    deleteMember,
    clearAll,
    loadDemoData,
  };
}

