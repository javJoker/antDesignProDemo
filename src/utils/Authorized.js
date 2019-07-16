import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from './authority';

let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

// Reload the rights component
const reloadAuthorized = () => {
  // FIXME
  Authorized = RenderAuthorized(getAuthority('admin'));
};

export { reloadAuthorized };
export default Authorized;
