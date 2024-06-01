import { create } from 'zustand';

interface useAllimagesModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useAllimagesModal = create<useAllimagesModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false })
}));


export default useAllimagesModal;
