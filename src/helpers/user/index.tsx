import { createContext } from 'react';

interface MyContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    tokens: any;
    setTokens: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<MyContextType>({
    loading: false,
    setLoading: () => { },
    user: '',
    setUser: () => { },
    tokens:'',
    setTokens:()=>{}

});

export default UserContext;