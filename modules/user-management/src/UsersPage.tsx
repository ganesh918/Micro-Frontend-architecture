import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Pencil, Trash2 } from 'lucide-react';
import { api, publishEvent, subscribeEvent, useDebounce, useIsMobile } from '@mfd/shared-utils';
import type { PaginatedResponse, User } from '@mfd/shared-types';
import {
  Avatar, Badge, Button, Card, EmptyState, ErrorState, Input, Modal, Select,
  Table, TableRowSkeleton,
} from '@mfd/shared-ui';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);

  const debouncedSearch = useDebounce(search);

  const usersQuery = useQuery({
    queryKey: ['users', debouncedSearch, statusFilter, roleFilter, page],
    queryFn: () =>
      api.get<PaginatedResponse<User>>('/users', {
        search: debouncedSearch,
        status: statusFilter,
        role: roleFilter,
        page,
        pageSize: 10,
      }),
    refetchOnMount: 'always',
  });

  useEffect(() => {
    const unsubCreated = subscribeEvent('user:created', () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    });
    return unsubCreated;
  }, [queryClient]);

  const updateMutation = useMutation({
    mutationFn: (user: User) => api.put<User>(`/users/${user.id}`, user),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      publishEvent('user:updated', { userId: updated.id }, 'user-management');
      publishEvent('toast:show', { message: `${updated.name} updated successfully`, type: 'success' }, 'user-management');
      setEditUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      publishEvent('user:deleted', { userId: id }, 'user-management');
      publishEvent('toast:show', { message: 'User deleted successfully', type: 'success' }, 'user-management');
      setDeleteConfirm(null);
    },
  });

  const statusVariant = (status: User['status']) => {
    const map = { active: 'success', inactive: 'default', pending: 'warning' } as const;
    return map[status];
  };

  if (usersQuery.isLoading) {
    return (
      <div>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700 }}>User Management</h1>
        </div>
        <Card padding="none">
          {Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} columns={isMobile ? 2 : 4} />)}
        </Card>
      </div>
    );
  }
  if (usersQuery.isError) {
    return <ErrorState title="Failed to load users" onRetry={() => { void usersQuery.refetch(); }} />;
  }

  const { data: users, total, totalPages } = usersQuery.data!;

  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700 }}>User Management</h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginTop: '4px' }}>
          Manage platform users, roles, and permissions
        </p>
      </div>

      <Card padding="none">
        <div style={{ padding: '20px 24px', display: 'flex', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border)' }}>
          <div style={{ flex: '1 1 240px' }}>
            <Input
              placeholder="Search users..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Statuses' },
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
              { value: 'pending', label: 'Pending' },
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            style={{ minWidth: '140px' }}
          />
          <Select
            options={[
              { value: '', label: 'All Roles' },
              { value: 'admin', label: 'Admin' },
              { value: 'manager', label: 'Manager' },
              { value: 'viewer', label: 'Viewer' },
            ]}
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            style={{ minWidth: '140px' }}
          />
        </div>

        {users.length === 0 ? (
          <EmptyState
            title="No users found"
            description="Try adjusting your search or filter criteria."
            actionLabel="Clear filters"
            onAction={() => { setSearch(''); setStatusFilter(''); setRoleFilter(''); }}
          />
        ) : isMobile ? (
          <div style={{ padding: '8px 16px' }}>
            {users.map((u) => (
              <div
                key={u.id}
                style={{
                  padding: '16px 0',
                  borderBottom: '1px solid var(--color-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Avatar name={u.name} size={36} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{u.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{u.email}</div>
                  </div>
                  <Badge variant={statusVariant(u.status)} dot>{u.status}</Badge>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <Badge variant="info">{u.role}</Badge>
                  {u.department && <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{u.department}</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button variant="outline" size="sm" onClick={() => setEditUser(u)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(u)}>Delete</Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Table<User>
            data={users}
            keyExtractor={(u) => u.id}
            columns={[
              {
                key: 'name',
                header: 'User',
                render: (u) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Avatar name={u.name} size={32} />
                    <div>
                      <div style={{ fontWeight: 500 }}>{u.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{u.email}</div>
                    </div>
                  </div>
                ),
              },
              { key: 'role', header: 'Role', render: (u) => <Badge variant="info">{u.role}</Badge> },
              { key: 'department', header: 'Department', render: (u) => u.department ?? '—' },
              { key: 'status', header: 'Status', render: (u) => <Badge variant={statusVariant(u.status)} dot>{u.status}</Badge> },
              {
                key: 'actions',
                header: 'Actions',
                width: '120px',
                render: (u) => (
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <Button variant="ghost" size="sm" onClick={() => setEditUser(u)} aria-label="Edit">
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(u)} aria-label="Delete">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ),
              },
            ]}
          />
        )}

        {totalPages > 1 && (
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-border)' }}>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Showing {users.length} of {total} users
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      {editUser && (
        <Modal
          open
          onClose={() => setEditUser(null)}
          title="Edit User"
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button loading={updateMutation.isPending} onClick={() => updateMutation.mutate(editUser)}>Save</Button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Name" value={editUser.name} onChange={(e) => setEditUser({ ...editUser, name: e.target.value })} />
            <Input label="Email" value={editUser.email} onChange={(e) => setEditUser({ ...editUser, email: e.target.value })} />
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'viewer', label: 'Viewer' },
              ]}
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value as User['role'] })}
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'pending', label: 'Pending' },
              ]}
              value={editUser.status}
              onChange={(e) => setEditUser({ ...editUser, status: e.target.value as User['status'] })}
            />
          </div>
        </Modal>
      )}

      {deleteConfirm && (
        <Modal
          open
          onClose={() => setDeleteConfirm(null)}
          title="Delete User"
          footer={
            <>
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" loading={deleteMutation.isPending} onClick={() => deleteMutation.mutate(deleteConfirm.id)}>Delete</Button>
            </>
          }
        >
          <p>Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
        </Modal>
      )}
    </div>
  );
}
