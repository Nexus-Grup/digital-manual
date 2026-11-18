'use client';

import { useState } from 'react';
import styles from '@/_styles/cssUserPanelPage/CompanyUsers.module.css';
import { request } from '@/lib/request';
// ajuste o caminho se o seu CreateUserForm estiver em outra pasta
import { CreateUserForm, type CompanyCreateUserValues } from '@/_components/utils/CreateUserForm';
import { Modal } from './Modal';

type Props = {
  companyId: number;
  companyName: string;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateUserModal({ companyId, companyName, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(values: CompanyCreateUserValues) {
    setLoading(true);
    setError('');
    const err = await request(`/api/companies/${companyId}/members/new`, 'POST', values);
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    onCreated();
  }

  return (
    <Modal label="Create user" onClose={onClose} bare>
      <CreateUserForm
        variant="company"
        companies={[{ id: companyId, name: companyName }]}
        defaultCompanyId={companyId}
        loading={loading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
      {error && <p className={styles.modalError} role="alert">{error}</p>}
    </Modal>
  );
}