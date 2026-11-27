'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { request } from '@/lib/request';
// ajuste o caminho se o seu CreateUserForm estiver em outra pasta
import { CreateUserForm, type CompanyCreateUserValues } from '@/_components/utils/CreateUserForm';
import { Modal } from '../utils_panel/Modal';

type Props = {
  companyId: number;
  companyName: string;
  onClose: () => void;
  onCreated: () => void;
};

export function CreateUserModal({ companyId, companyName, onClose, onCreated }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(values: CompanyCreateUserValues) {
    setLoading(true);
    const err = await request(`/api/companies/${companyId}/members/new`, 'POST', values);
    setLoading(false);
    if (err) {
      toast.error(err);
      return;
    }
    toast.success('Usuário criado.');
    onCreated();
  }

  return (
    <Modal label="Criar usuário" onClose={onClose} bare>
      <CreateUserForm
        variant="company"
        companies={[{ id: companyId, name: companyName }]}
        defaultCompanyId={companyId}
        loading={loading}
        onCancel={onClose}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}