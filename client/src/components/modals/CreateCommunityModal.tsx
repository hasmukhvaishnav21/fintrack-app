import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users, Info } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCommunityModal({ isOpen, onClose }: CreateCommunityModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [approvalMode, setApprovalMode] = useState<'admin_only' | 'simple_majority' | 'weighted'>('admin_only');
  const { toast } = useToast();

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string; approvalMode: string }) => {
      return apiRequest('POST', '/api/communities', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/communities'] });
      toast({
        title: 'Community Created',
        description: 'Your community has been created successfully!',
      });
      handleClose();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create community',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      name: name.trim(),
      description: description.trim() || undefined,
      approvalMode,
    });
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setApprovalMode('admin_only');
    onClose();
  };

  const approvalModes = [
    {
      id: 'admin_only',
      name: 'Admin Only',
      description: 'Only you can approve investment decisions',
      icon: '👑',
    },
    {
      id: 'simple_majority',
      name: 'Simple Majority',
      description: 'More than 50% of members must approve',
      icon: '🗳️',
    },
    {
      id: 'weighted',
      name: 'Weighted Vote',
      description: 'Vote weight based on contribution amount',
      icon: '⚖️',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 z-[100]"
            data-testid="modal-backdrop"
          />

          {/* Full-Screen Modal */}
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed inset-0 max-w-md w-full mx-auto flex flex-col bg-background z-[110]"
            data-testid="modal-create-community"
          >
            {/* Header with safe area padding */}
            <div className="flex-shrink-0 px-4 pt-12 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-foreground">Create Community</h2>
                </div>
                <button
                  onClick={handleClose}
                  className="w-9 h-9 rounded-full bg-card flex items-center justify-center hover-elevate active-elevate-2"
                  data-testid="button-close"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col h-full">
              {/* Scrollable Form Body */}
              <div className="flex-1 overflow-y-auto px-4 space-y-4">
                {/* Community Name */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Community Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Family Gold Fund, Friends Investment Club"
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary"
                    data-testid="input-name"
                    required
                    maxLength={50}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of your community's investment goals..."
                    className="w-full px-4 py-3 rounded-2xl bg-card text-foreground border border-border focus:outline-none focus:border-primary resize-none"
                    data-testid="input-description"
                    rows={3}
                    maxLength={200}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {description.length}/200 characters
                  </p>
                </div>

                {/* Approval Mode */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Decision Making
                  </label>
                  <div className="space-y-2">
                    {approvalModes.map((mode) => (
                      <button
                        key={mode.id}
                        type="button"
                        onClick={() => setApprovalMode(mode.id as typeof approvalMode)}
                        className={`w-full p-4 rounded-2xl text-left transition-all ${
                          approvalMode === mode.id
                            ? 'bg-primary/10 border-2 border-primary'
                            : 'bg-card border border-border hover-elevate'
                        }`}
                        data-testid={`button-mode-${mode.id}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{mode.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium text-foreground mb-0.5">
                              {mode.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {mode.description}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Box */}
                <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-foreground mb-1 font-medium">
                        You'll be the admin
                      </p>
                      <p className="text-xs text-muted-foreground">
                        As the creator, you can invite members, manage roles, and have full control over community settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fixed Footer */}
              <div className="flex-shrink-0 p-4 border-t border-border">
                <button
                  type="submit"
                  disabled={!name.trim() || createMutation.isPending}
                  className="w-full py-3.5 rounded-2xl bg-primary text-white font-semibold hover-elevate active-elevate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  data-testid="button-submit"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Community'}
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
