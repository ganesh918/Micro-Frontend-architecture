import { Button, Modal } from '@mfd/shared-ui';

interface LogoutConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutConfirmModal({ open, onClose, onConfirm }: LogoutConfirmModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Sign out"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Sign out
          </Button>
        </>
      }
    >
      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
        Are you sure you want to sign out? You will need to log in again to access the dashboard.
      </p>
    </Modal>
  );
}
