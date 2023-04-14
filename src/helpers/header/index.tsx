import { createContext } from 'react';

interface MyContextType {

    header: any;
    setHeader: any;
}

const HeaderContext = createContext<MyContextType>({
    header: '',
    setHeader: null

});

export default HeaderContext;