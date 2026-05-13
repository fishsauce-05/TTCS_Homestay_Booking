import { injectSharedComponents } from './shared/components.js';
import { bindAuthHandlers, checkAuthState } from './shared/auth.js';
import { initScrollEffects } from './features/scroll-effects-init.js';
import { initDateInputs } from './features/date-inputs-init.js';

export default function initApp() {
  injectSharedComponents();
  bindAuthHandlers();
  checkAuthState();
  initScrollEffects();
  initDateInputs();
}
