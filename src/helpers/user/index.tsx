import { createContext } from 'react';

interface MyContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    user: any;
    setUser: React.Dispatch<React.SetStateAction<any>>;
}

const UserContext = createContext<MyContextType>({
    loading: false,
    setLoading: () => { },
    user: '',
    setUser: () => { },

});

export default UserContext;