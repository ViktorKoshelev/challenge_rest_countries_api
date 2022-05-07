import { createContext } from 'react';
import RESTStore from './stores/RESTStore';

const RESTContext = createContext<RESTStore | null>(null);
export default RESTContext;
