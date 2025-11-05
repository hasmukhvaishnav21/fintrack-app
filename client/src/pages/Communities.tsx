import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Plus, Search, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Community } from '@shared/schema';
import CreateCommunityModal from '@/components/modals/CreateCommunityModal';

export default function Communities() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch user's communities
  const { data: communities = [], isLoading } = useQuery<Community[]>({
    queryKey: ['/api/communities'],
  });

  // Filter communities based on search
  const filteredCommunities = communities.filter(community =>
    community.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header with safe area padding */}
      <div className="flex-shrink-0 px-4 pt-12 pb-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Communities</h1>
            <p className="text-sm text-muted-foreground">Invest together, grow together</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover-elevate active-elevate-2"
            data-testid="button-create-community"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search communities..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card text-foreground border border-border focus:outline-none focus:border-primary text-sm"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Communities List */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-2xl bg-card animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : filteredCommunities.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-12 px-6 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchQuery ? 'No communities found' : 'No communities yet'}
            </h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
              {searchQuery
                ? 'Try searching with different keywords'
                : 'Create or join a community to start investing together with friends and family'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2.5 rounded-xl bg-primary text-white font-medium hover-elevate active-elevate-2"
                data-testid="button-create-first"
              >
                Create Community
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3 pb-24">
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <CommunityCard community={community} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
}

interface CommunityCardProps {
  community: Community;
}

function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div
      className="p-4 rounded-2xl bg-card border border-border hover-elevate active-elevate-2 cursor-pointer"
      data-testid={`card-community-${community.id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {community.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              {community.memberCount} member{community.memberCount !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>

      {community.description && (
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {community.description}
        </p>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-3.5 h-3.5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
            <DollarSign className="w-3.5 h-3.5 text-green-500" />
          </div>
          <span className="text-xs text-muted-foreground">
            {community.approvalMode === 'admin_only'
              ? 'Admin Only'
              : community.approvalMode === 'simple_majority'
              ? 'Majority Vote'
              : 'Weighted Vote'}
          </span>
        </div>
      </div>
    </div>
  );
}
