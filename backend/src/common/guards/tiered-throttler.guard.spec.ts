import { TieredThrottlerGuard, UserTier } from './tiered-throttler.guard';

describe('TieredThrottlerGuard', () => {
  describe('resolveUserTier', () => {
    it('should return FREE for undefined user', () => {
      expect(TieredThrottlerGuard.resolveUserTier(undefined)).toBe(
        UserTier.FREE,
      );
    });

    it('should return FREE for user with no role or KYC', () => {
      expect(TieredThrottlerGuard.resolveUserTier({})).toBe(UserTier.FREE);
    });

    it('should return ADMIN for admin role', () => {
      expect(TieredThrottlerGuard.resolveUserTier({ role: 'ADMIN' })).toBe(
        UserTier.ADMIN,
      );
    });

    it('should return VERIFIED for KYC-approved user', () => {
      expect(
        TieredThrottlerGuard.resolveUserTier({
          role: 'USER',
          kycStatus: 'APPROVED',
        }),
      ).toBe(UserTier.VERIFIED);
    });

    it('should return ENTERPRISE for enterprise tier', () => {
      expect(TieredThrottlerGuard.resolveUserTier({ tier: 'enterprise' })).toBe(
        UserTier.ENTERPRISE,
      );
    });

    it('should return PREMIUM for premium tier', () => {
      expect(TieredThrottlerGuard.resolveUserTier({ tier: 'premium' })).toBe(
        UserTier.PREMIUM,
      );
    });

    it('should prioritize enterprise tier over admin role', () => {
      expect(
        TieredThrottlerGuard.resolveUserTier({
          role: 'ADMIN',
          tier: 'enterprise',
        }),
      ).toBe(UserTier.ENTERPRISE);
    });
  });

  describe('getLimitsForTier', () => {
    it('should return default limits for FREE tier', () => {
      const limits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.FREE,
        'default',
      );
      expect(limits.limit).toBe(60);
      expect(limits.ttl).toBe(60000);
    });

    it('should return auth limits for FREE tier', () => {
      const limits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.FREE,
        'auth',
      );
      expect(limits.limit).toBe(5);
    });

    it('should return higher limits for VERIFIED tier', () => {
      const freeLimits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.FREE,
        'default',
      );
      const verifiedLimits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.VERIFIED,
        'default',
      );
      expect(verifiedLimits.limit).toBeGreaterThan(freeLimits.limit);
    });

    it('should return highest limits for ADMIN tier', () => {
      const adminLimits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.ADMIN,
        'default',
      );
      expect(adminLimits.limit).toBe(1000);
    });

    it('should fallback to default for unknown throttler name', () => {
      const limits = TieredThrottlerGuard.getLimitsForTier(
        UserTier.FREE,
        'nonexistent',
      );
      expect(limits.limit).toBe(60);
    });

    it('should have progressively higher limits across tiers', () => {
      const tiers = [
        UserTier.FREE,
        UserTier.VERIFIED,
        UserTier.PREMIUM,
        UserTier.ENTERPRISE,
      ];
      const limits = tiers.map((tier) =>
        TieredThrottlerGuard.getLimitsForTier(tier, 'default'),
      );

      for (let i = 1; i < limits.length; i++) {
        expect(limits[i].limit).toBeGreaterThan(limits[i - 1].limit);
      }
    });

    it('should have RPC limits for all tiers', () => {
      for (const tier of Object.values(UserTier)) {
        const limits = TieredThrottlerGuard.getLimitsForTier(tier, 'rpc');
        expect(limits.limit).toBeGreaterThan(0);
        expect(limits.ttl).toBeGreaterThan(0);
      }
    });
  });
});
