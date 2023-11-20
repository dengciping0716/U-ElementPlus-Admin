import { withInstall, withNoopInstall } from '../../utils';
import Card from './src/index.vue';

export const mCard = withInstall(Card);
export default mCard;
