// API service for family member operations

import { API_BASE_URL, DEFAULT_USER_ID } from '../config';

/**
 * Fetch all family members for the current user
 */
export async function fetchMembers(userId = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/members?userId=${userId}`);
  if (!response.ok) {
    throw new Error('Could not reach the backend server.');
  }
  const data = await response.json();
  // Sort by generation (descending - oldest first)
  return data.sort((a, b) => (b.generation || 0) - (a.generation || 0));
}

/**
 * Create a new family member
 */
export async function createMember(memberData, userId = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...memberData, userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to create member.');
  }
  return response.json();
}

/**
 * Update an existing family member
 */
export async function updateMember(id, memberData, userId = DEFAULT_USER_ID) {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...memberData, userId }),
  });
  if (!response.ok) {
    throw new Error('Failed to update member.');
  }
  return response.json();
}

/**
 * Delete a family member
 */
export async function deleteMember(id) {
  const response = await fetch(`${API_BASE_URL}/members/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete member.');
  }
  return response.json();
}

/**
 * Delete all members for a user
 */
export async function deleteAllMembers(members) {
  const promises = members.map(member => deleteMember(member.id));
  return Promise.all(promises);
}

