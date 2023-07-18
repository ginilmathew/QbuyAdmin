import { createContext } from 'react';

interface MyContextType {

    firebase: any;
    setFirebase: React.Dispatch<React.SetStateAction<any>>;
}

const FirebaseContext = createContext<MyContextType>({

    firebase:'',
    setFirebase:()=>{}

});

export default FirebaseContext;