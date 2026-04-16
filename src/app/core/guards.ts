import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Api } from './api';

export const authGuard: CanActivateFn = () => {
    const api = inject(Api);
    const router = inject(Router);
    if (api.verify()) return true;
    return router.createUrlTree(['/settings']);
};

export const guestGuard: CanActivateFn = () => {
    const api = inject(Api);
    const router = inject(Router);
    if (!api.verify()) return true;
    return router.createUrlTree(['/users']);
};
