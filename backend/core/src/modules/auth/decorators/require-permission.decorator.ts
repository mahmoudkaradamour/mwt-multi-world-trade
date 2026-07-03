import { SetMetadata } from '@nestjs/common';

/**
 * Authorization metadata key.
 */
export const PERMISSION_KEY = 'permission';

/**
 * Permission requirement contract.
 */
export interface RequiredPermission {
  resource: string;
  action: string;
}

/**
 * Require a specific permission
 * to access the decorated route.
 *
 * Example:
 *
 * @RequirePermission(
 *   'products',
 *   'create',
 * )
 */
export const RequirePermission = (
  resource: string,
  action: string,
) =>
  SetMetadata(
    PERMISSION_KEY,
    {
      resource,
      action,
    } satisfies RequiredPermission,
  );